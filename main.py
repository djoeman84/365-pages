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

months = ["NONE","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
days_of_week = ["MON","TUE","WED","THR","FRI","SAT","SUN"]
password = "07c05679b1cfed895de0d8383a02cafb7a040d5db41878fa2c47103fe7aba541"
username = "imgur"

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))

class Page(db.Model):
	title = db.StringProperty(required = True)
	href = db.LinkProperty(required = True)
	date = db.DateTimeProperty(auto_now_add = True)
	desc = db.TextProperty(required=True)


class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)
	def render_str(self, template, **params):
		t = jinja_env.get_template(template)
		return t.render(params)
	def render(self, template, **kw):
		self.write(self.render_str(template, **kw))


class MainHandler(Handler):
	def get_days(self):
		pass	
	def get_data(self):
		return '{"%s"}'
	def get_info(self):
		pages = db.GqlQuery("SELECT * FROM Page ORDER BY date ASC").fetch(limit=365)
		days = [{"id":str(page.key()).replace('-','_'),"href":page.href,"date":str(page.date.day) + " " + months[page.date.month],"day":days_of_week[page.date.weekday()]} for page in pages]
		data = ','.join(['"%s":{"title":"%s","desc":"%s","href":"%s"}' % (str(page.key()).replace('-','_'), page.title, page.desc, page.href) for page in pages])
		return data, days
	def render_page(self):
		data, days = self.get_info()
		self.render("index.html", days = days, data = data)
	def get(self):
		self.render_page()

class PostHandler(Handler):
	def get(self):
		self.render("post.html", error="")
	def post(self):
		title = self.request.get("title")
		href  = self.request.get("href")
		desc  = self.request.get("desc")
		usr   = self.request.get("usr")
		passw = self.request.get("pass")
		if (not passw == password) or (not usr == username):
			error = "incorrect password"
			self.render("post.html", error=error)
			return
		if title and href and desc:
			p = Page(title=title, href=href, desc=desc)
			p.put()
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

app = webapp2.WSGIApplication([
	('/', MainHandler), ('/post', PostHandler),
	('/4-AUG', Aug4Handler),
	('/5-AUG', Aug5Handler)
], debug=True)
