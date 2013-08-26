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
import urllib2
import hashlib
import math

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
	tzone= db.IntegerProperty(required = True)

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
	date += datetime.timedelta(hours = page.tzone) 
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
			p = Page(title=title, href=href, desc=desc, tzone=tzone)
			p.put()
			while (p.get(p.key()) == None):
				time.sleep(0.01);
				print 'wait'
			get_info(True)
			self.redirect("../")
		else:
			error = "please fill all fields"
			self.render("post.html", error=error)
	


def json_switch(api):
	return {
		'ski':json_ski, #ski slope game from aug 7
		'nyt':json_nyt
	}.get(api,json_na)

def json_na(request):
	return {"request":None}

def json_nyt(request):
	return {"request":{"name":request.get("name")}}

def json_ski(request):
	num_requests   = request.get("num")
	fetch_requests = request.get("f")
	if not num_requests:
		num_requests = 5
	top_scores = db.GqlQuery("SELECT * FROM TopScore ORDER BY score DESC").fetch(limit=int(num_requests))
	scores = [{"name":score.name,"score":score.score,"donuts":score.donuts,"date":date_to_json(score.date)} for score in top_scores]
	json_top_scores = {"request":{"scores":scores}}
	return json_top_scores

def date_to_json(date):
	# Convert date/datetime to MILLISECONDS-since-epoch (JS "new Date()").
	#copied from http://stackoverflow.com/questions/1531501/json-serialization-of-google-app-engine-models
	ms = time.mktime(date.utctimetuple()) * 1000
	ms += getattr(date, 'microseconds', 0) / 1000
	return int(ms)

class JSONHandler(Handler):
	def get(self):
		api = self.request.get("api")
		json_obj = json_switch(api)(self.request) #dictionary based switch statement on functions
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps(json_obj));	


class Aug4Handler(Handler):
	def get(self):
		self.render("aug_4.html")

class Aug5Handler(Handler):
	def get(self):
		self.render("aug_5.html")

class Aug6Handler(Handler):
	def get(self):
		self.render("aug_6.html")

class Aug7Handler(Handler):
	def get(self):
		self.render("aug_7.html")
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
		self.render('aug_9.html')

class Aug10Handler(Handler):
	def get(self):
		self.render('aug_10.html')

class Aug11Handler(Handler):
	def get(self):
		self.render('aug_11.html')

class Aug12Handler(Handler):
	def get(self):
		self.render('aug_12.html')

class Aug13Handler(Handler):
	def get(self):
		self.render('aug_13.html')

class Aug14Handler(Handler):
	def get(self):
		self.render('aug_14.html')

class Aug15Handler(Handler):
	def get(self):
		self.render('aug_15.html')

nyt_api_key = 'b1ee2e9937cc362be3892ed1e2ea0eff:0:58566570'
nyt_json_url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=romney&begin_date=20120101&end_date=20120101&facet_field=day_of_week&fl=keywords&api-key='+nyt_api_key
class Aug16Handler(Handler):
	def get(self):
		data = json.load(urllib2.urlopen(nyt_json_url))
		nyt_json = [kw['value'] for entries in data['response']['docs'] for kw in entries['keywords'] if kw['name'] == 'glocations']
		self.render('aug_16.html', nyt_json = ",".join(['"'+entry+'"' for entry in nyt_json]), num_res = len(data['response']['docs']))

class Aug17Handler(Handler):
	def get(self):
		self.render('aug_17.html')

class Aug18Handler(Handler):
	def get(self):
		self.render('aug_18.html')

class Aug19Handler(Handler):
	def get(self):
		self.render('aug_19.html')

class Aug20Handler(Handler):
	def get(self):
		self.render('aug_20.html')

class Aug21Handler(Handler):
	def get(self):
		self.render('aug_21.html')

class Aug22Handler(Handler):
	def get(self):
		self.render('aug_22.html')

class Aug23Handler(Handler):
	def get(self):
		self.render('aug_23.html')

class Aug24Handler(Handler):
	def get(self):
		self.render('aug_24.html')

class Aug25Handler(Handler):
	def get(self):
		self.render('aug_25.html')



app = webapp2.WSGIApplication([
	('/', MainHandler), ('/post', PostHandler),
	('/4-AUG',  Aug4Handler),
	('/5-AUG',  Aug5Handler),
	('/6-AUG',  Aug6Handler),
	('/7-AUG',  Aug7Handler),
	('/8-AUG',  Aug8Handler),
	('/9-AUG',  Aug9Handler),
	('/10-AUG', Aug10Handler),
	('/11-AUG', Aug11Handler),
	('/12-AUG', Aug12Handler),
	('/13-AUG', Aug13Handler),
	('/14-AUG', Aug14Handler),
	('/15-AUG', Aug15Handler),
	('/16-AUG', Aug16Handler),
	('/17-AUG', Aug17Handler),
	('/18-AUG', Aug18Handler),
	('/19-AUG', Aug19Handler),
	('/20-AUG', Aug20Handler),
	('/21-AUG', Aug21Handler),
	('/22-AUG', Aug22Handler),
	('/23-AUG', Aug23Handler),
	('/24-AUG', Aug24Handler),
	('/25-AUG', Aug25Handler),
	('/json', JSONHandler),
	('/.*',  MainHandler)
], debug=True)



