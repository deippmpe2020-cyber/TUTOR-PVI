import urllib.request, urllib.parse, http.cookiejar, re

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

resp = opener.open("https://pvi.pm.pe.gov.br/login/index.php")
html = resp.read().decode("utf-8", errors="ignore")
token = re.search(r'name="logintoken" value="([^"]+)"', html).group(1)

data = urllib.parse.urlencode({"logintoken": token, "username": "guest", "password": "guest"}).encode()
opener.open("https://pvi.pm.pe.gov.br/login/index.php", data=data)

resp3 = opener.open("https://pvi.pm.pe.gov.br/course/index.php")
c_html = resp3.read().decode("utf-8", errors="ignore")

courses = re.findall(r'course/view\.php\?id=([0-9]+)[^>]*>(.*?)</a>', c_html)
print(f"Courses found: {len(courses)}")
for cid, name in courses[:30]:
    print(f"ID: {cid} -> {re.sub(r'<[^>]+>', '', name).strip()}")

cats = re.findall(r'course/index\.php\?categoryid=([0-9]+)[^>]*>(.*?)</a>', c_html)
print(f"Categories found: {len(cats)}")
for catid, name in cats[:30]:
    print(f"Cat ID: {catid} -> {re.sub(r'<[^>]+>', '', name).strip()}")
