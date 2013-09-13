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
from time import mktime
from google.appengine.api import channel

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

def safe_get_list(arg_list, index, default=None):
	if (index < len(arg_list) and index >= 0):
		return arg_list[index]
	else:
		return default

CACHE = {}
def cached_query(query, fetch_quant = 10, refresh = True):
	if (query,fetch_quant) not in CACHE or refresh:
		CACHE[(query,fetch_quant)] = db.GqlQuery(query).fetch(limit=fetch_quant)
	return CACHE[(query,fetch_quant)]



class Post(db.Model):
	title       = db.StringProperty(required = True)
	href        = db.LinkProperty(required = True)
	date_posted = db.DateTimeProperty(auto_now_add = True)
	target_date = db.DateProperty(required = True, auto_now_add = False)
	desc        = db.TextProperty(required = True)
	tzone       = db.IntegerProperty(required = True)

class TopScore(db.Model):
	name   = db.StringProperty(required = True)
	score  = db.IntegerProperty(required = True)
	donuts = db.IntegerProperty(required = True)
	date   = db.DateTimeProperty(auto_now_add = True)
	loc    = db.GeoPtProperty(required = False)

class RecipieCard(db.Model):
	submit_time  = db.DateTimeProperty(auto_now_add = True)
	title        = db.StringProperty(required = True)
	ingredients  = db.StringListProperty (required = True)
	instructions = db.StringListProperty (required = True)


class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)
	def render_str(self, template, **params):
		t = jinja_env.get_template(template)
		return t.render(params)
	def render(self, template, **kw):
		self.write(self.render_str(template, **kw))

def get_date_with_timezone(post):
	date = post.date_posted
	date += datetime.timedelta(hours = post.tzone) 
	return (date)

def get_info(refresh=False):
	posts = cached_query(query='SELECT * FROM Post ORDER BY target_date ASC', fetch_quant = 366, refresh = True)
	days = [{"id":str(post.key()).replace('-','_'),"href":post.href,"date":str(post.target_date.day) + " " + months[post.target_date.month],"day":days_of_week[post.target_date.weekday()]} for post in posts]
	data = ','.join(['"%s":{"title":"%s","desc":"%s","href":"%s","month":%d}' % (str(post.key()).replace('-','_'), post.title, post.desc, post.href,post.target_date.month) for post in posts])
	month_anchors = ['' for x in range(13)] #13 since month 0 is nothing
	for post in posts:
		if not month_anchors[post.target_date.month]:
			month_anchors[post.target_date.month] = str(post.key()).replace('-','_')
	month_anchors = ','.join(['"%s"' %(a) for a in month_anchors])
	return data, month_anchors, days

class MainHandler(Handler):
	def render_page(self):
		data, month_anchors, days = get_info()
		self.render("index.html", days = days, data = data, month_anchors = month_anchors)
	def get(self):
		self.render_page()

class PostHandler(Handler):
	def get(self):
		refresh = self.request.get("refresh")
		posts = cached_query(query='SELECT * FROM Post ORDER BY target_date ASC', fetch_quant = 366, refresh = True)
		likely_date = posts[len(posts) - 1].target_date + datetime.timedelta(days = 1)
		self.render("post.html", error="", t_date=likely_date.strftime('%Y-%m-%d'))
	def post(self):
		title  = self.request.get("title")
		href   = self.request.get("href")
		desc   = self.request.get("desc")
		tzone  = int(self.request.get("tzone"))
		usr    = self.request.get("usr")
		passw  = self.request.get("pass")
		t_date = self.request.get("target_date")
		print "\n\ntzone: " + str(tzone)
		if (not passw == password) or (not usr == username):
			error = "incorrect password"
			self.render("post.html", error=error)
			return
		if title and href and desc and tzone and t_date:
			target_date = datetime.datetime.fromtimestamp(mktime(time.strptime(t_date,'%Y-%m-%d'))).date()
			p = Post(title=title, href=href, desc=desc, tzone=tzone, target_date=target_date)
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
		'nyt':json_nyt,
		'pgs':json_pages
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
	top_scores = cached_query(query = 'SELECT * FROM TopScore ORDER BY score DESC', fetch_quant = int(num_requests))
	scores = [{"name":score.name,"score":score.score,"donuts":score.donuts,"date":date_to_json(score.date)} for score in top_scores]
	json_top_scores = {"request":{"scores":scores}}
	return json_top_scores

def json_pages(request):
	num_requests = request.get("num");
	if not num_requests:
		num_requests = 366
	q = cached_query(query = 'SELECT * FROM Post ORDER BY target_date ASC', fetch_quant = int(num_requests))
	return {"request":{"pages":[{"title":pg.title,"href":pg.href} for pg in q]}}




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
		self.response.out.write(json.dumps(json_obj))

channels = {}
class ChannelHandler(Handler):
	def get(self):
		api         = self.request.get("api")
		key         = self.request.get("key")
		m           = hashlib.md5()
		m.update(api+key+str(time.time()))
		digest = m.hexdigest()
		channel_id  = channel.create_channel(digest)
		if api+key not in channels:
			channels[api+key] = []
		channels[api+key].append(channel_id)
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps({'channel_id':channel_id}))
	def post(self):
		api         = self.request.get("api")
		key         = self.request.get("key")
		if api+key in channels:
			for channel_id in channels[api+key]:
				channel.send_message(channel_id, self.request.body)


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
		ts.put()
		while (ts.get(p.key()) == None):
			time.sleep(0.01);
			print 'wait'
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

class Aug26Handler(Handler):
	def get(self):
		self.render('aug_26.html')

class Aug27Handler(Handler):
	def get(self):
		self.render('aug_27.html')

class Aug28Handler(Handler):
	def get(self):
		self.render('aug_28.html')

class Aug29Handler(Handler):
	def get(self):
		self.render('aug_29.html')

class Aug30Handler(Handler):
	def get(self):
		self.render('aug_30.html')

class Aug31Handler(Handler):
	def get(self):
		self.render('aug_31.html')

class Sep1Handler(Handler):
	def get(self):
		self.render('sep_1.html')

class Sep2Handler(Handler):
	def get(self):
		self.render('sep_2.html')

class Sep3Handler(Handler):
	def get(self):
		db_cards   = cached_query(query='SELECT * FROM RecipieCard ORDER BY submit_time DESC', fetch_quant = 20, refresh = True)
		disp_cards = [{'id':card.key(),'title':card.title,'ingredients':card.ingredients,'instructions':card.ingredients} for card in db_cards]
		self.render('sep_3.html', cards=disp_cards)
	def post(self):
		card_json = json.loads(self.request.body)
		try:
			if(card_json.get('data').get('type') == 'new'):
				template_card = {
									'title':'title',
									'ingredients':['first ingredient'],
									'instructions':['step one']
								}
				r = RecipieCard(title = template_card['title'], ingredients = template_card['ingredients'],instructions = template_card['instructions'])
				r.put()
				response_json = {'data':{
									'id':str(r.key()),
									'title':template_card['title'],
									'ingredients':template_card['ingredients'],
									'instructions':template_card['instructions']
								}}
				self.response.headers['Content-Type'] = 'application/json'
				self.response.out.write(json.dumps(response_json));
			elif card_json.get('data').get('type') == 'update':
				fields = card_json.get('data').get('fields')
				r = RecipieCard.get(fields.get('id'))
				r.title = fields.get('title')[0]
				r.ingredients  = fields.get('ingredients')
				r.instructions = fields.get('instructions')
				r.put()
		except:
			print 'post error'
		

class Sep4Handler(Handler):
	def get(self):
		self.render('sep_4.html')

class Sep5Handler(Handler):
	def get(self):
		self.render('sep_5.html')

class Sep6Handler(Handler):
	def get(self):
		self.render('sep_6.html')

class Sep7Handler(Handler):
	def get(self):
		self.render('sep_7.html')

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
	('/26-AUG', Aug26Handler),
	('/27-AUG', Aug27Handler),
	('/28-AUG', Aug28Handler),
	('/29-AUG', Aug29Handler),
	('/30-AUG', Aug30Handler),
	('/31-AUG', Aug31Handler),
	('/1-SEP',  Sep1Handler),
	('/2-SEP',  Sep2Handler),
	('/3-SEP',  Sep3Handler),
	('/4-SEP',  Sep4Handler),
	('/5-SEP',  Sep5Handler),
	('/6-SEP',  Sep6Handler),
	('/7-SEP',  Sep7Handler),
	('/json', JSONHandler),
	('/channelAPI',ChannelHandler)
], debug=True)



