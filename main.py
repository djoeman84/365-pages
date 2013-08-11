#
#
#     365 Pages Server
#
#
#
import webapp2
import jinja2
import os
from google.appengine.ext import db
import datetime
import time
import json
import hashlib

months = ["NONE","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
days_of_week = ["MON","TUE","WED","THR","FRI","SAT","SUN"]
password = "07c05679b1cfed895de0d8383a02cafb7a040d5db41878fa2c47103fe7aba541"
username = "imgur"

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))


def hash_str(s):
        return hashlib.md5(s).hexdigest()

def make_secure_val(s):
        return "%s|%s" % (s, hash_str(s+'49f68a5c8493ec2c0bf489821c21fc3b'))

def check_secure_val(h):
        val = h.split('|')[0]
        if h == make_secure_val(val):
                return val


class Page(db.Model):
	title = db.StringProperty(required = True)
	href = db.LinkProperty(required = True)
	date = db.DateTimeProperty(auto_now_add = True)
	desc = db.TextProperty(required = True)
	tzone= db.IntegerProperty()

class TopScore(db.Model):
	name   = db.StringProperty(required = True)
	score  = db.IntegerProperty(required = True)
	donuts = db.IntegerProperty(required = True)
	date   = db.DateTimeProperty(auto_now_add = True)
	loc    = db.GeoPtProperty(required = False)
				


class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)
	def render_str(self, template, **params):
		t = jinja_env.get_template(template)
		return t.render(params)
	def render(self, template, **kw):
		self.write(self.render_str(template, **kw))

CACHE = {}
def get_date(page):
	date = page.date
	date += datetime.timedelta(hours = -8) #hack way to offset to real timezone
	#try:
	#	print "========="+page.tzone
	#	date += datetime.timedelta(hours = page.tzone)
	#except:
	#	print "=========NA"
	return (date)

def get_info(refresh=False):
	key = 'main_daily_posts'
	if (not refresh) and key in CACHE:
		return CACHE[key]['data'], CACHE[key]['month_anchors'], CACHE[key]['days']
	else:
		print '::GqlQuery'
		pages = db.GqlQuery("SELECT * FROM Page ORDER BY date ASC").fetch(limit=365)
		days = [{"id":str(page.key()).replace('-','_'),"href":page.href,"date":str(get_date(page).day) + " " + months[get_date(page).month],"day":days_of_week[get_date(page).weekday()]} for page in pages]
		data = ','.join(['"%s":{"title":"%s","desc":"%s","href":"%s","month":%d}' % (str(page.key()).replace('-','_'), page.title, page.desc, page.href,get_date(page).month) for page in pages])
		month_anchors = ['' for x in range(13)] #13 since month 0 is nothing
		for page in pages:
			if not month_anchors[get_date(page).month]:
				month_anchors[get_date(page).month] = str(page.key()).replace('-','_')
		month_anchors = ','.join(['"%s"' %(a) for a in month_anchors])
		CACHE[key] = {'data':data, 'month_anchors':month_anchors,'days':days}
		return data, month_anchors, days

class MainHandler(Handler):
	def render_page(self):
		data, month_anchors, days = get_info()
		self.render("index.html", days = days, data = data, month_anchors = month_anchors)
	def get(self):
		#get_info(True)
		self.render_page()

class PostHandler(Handler):
	def get(self):
		self.render("post.html", error="")
	def post(self):
		title = self.request.get("title")
		href  = self.request.get("href")
		desc  = self.request.get("desc")
		tzone = int(self.request.get("tzone"))
		usr   = self.request.get("usr")
		passw = self.request.get("pass")
		print "\n\ntzone: " + str(tzone)
		if (not passw == password) or (not usr == username):
			error = "incorrect password"
			self.render("post.html", error=error)
			return
		if title and href and desc and tzone:
			p = Page(title=title, href=href, desc=desc, tzone=5)
			p.put()
			while (p.get(p.key()) == None):
				time.sleep(0.01);
				print 'wait'
			get_info(True)
			self.redirect("../")
		else:
			error = "please fill all fields"
			self.render("post.html", error=error)
		


class Aug4Handler(Handler):
	def get(self):
		self.render("aug_4.html")

class Aug5Handler(Handler):
	def get(self):
		self.render("aug_5.html")

class Aug6Handler(Handler):
	def get(self):
		self.render("aug_6.html")

def get_js_top_score_data(refresh = False):
	key = 'aug_7_top_scores_js_data'
	if not refresh and key in CACHE:
		return CACHE[key]
	else:
		print 'GqlQuery: '+ key
		top_scores = db.GqlQuery("SELECT * FROM TopScore ORDER BY score DESC").fetch(limit=5)
		js_top_score_data = ','.join(['{"name":"%s","score":"%s","donuts":"%s","date":"%s","loc":"%s"}' %(score.name, score.score, score.donuts, score.date,score.loc) for score in top_scores])
		CACHE[key] = js_top_score_data
		return js_top_score_data

class Aug7Handler(Handler):
	def get(self):
		self.render("aug_7.html", data=get_js_top_score_data())
	def post(self):
		name  = self.request.get("name")
		loc   = self.request.get("loc")
		score = int(float(self.request.get("score")))
		donuts= int(self.request.get("donuts"))
		ts = None
		if name and score and donuts:
			if loc:
				ts = TopScore(name=name,score=score,donuts=donuts,loc=loc)
			else:
				ts = TopScore(name=name,score=score,donuts=donuts)
		while (ts.get(p.key()) == None):
			time.sleep(0.01);
			print 'wait'
		ts.put()
		print "post: name-"+name+"\nloc-"+loc+"\nscore-"+str(score)+"\ndonuts-"+str(donuts)
		get_js_top_score_data(True)

class Aug8Handler(Handler):
	def get(self):
		cookie_str = self.request.cookies.get('visits', 0)
		visits = 0
		if (cookie_str):
			cookie_val = check_secure_val(cookie_str)
			if cookie_val:
				visits = int(cookie_val)
		visits += 1

		new_cookie = make_secure_val(str(visits))
		self.response.headers.add_header('Set-Cookie', 'visits='+new_cookie)
		self.render("aug_8.html", visits=visits)

class Aug9Handler(Handler):
	def get(self):
		self.render('aug_9.html');

class Aug10Handler(Handler):
	def get(self):
		self.render('aug_10.html');


app = webapp2.WSGIApplication([
	('/', MainHandler), ('/post', PostHandler),
	('/4-AUG',  Aug4Handler),
	('/5-AUG',  Aug5Handler),
	('/6-AUG',  Aug6Handler),
	('/7-AUG',  Aug7Handler),
	('/8-AUG',  Aug8Handler),
	('/9-AUG',  Aug9Handler),
	('/10-AUG', Aug10Handler)
], debug=True)



