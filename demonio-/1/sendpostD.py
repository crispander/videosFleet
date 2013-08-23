#!/usr/bin/python
#-*- coding: utf-8 -*-

import time
import random
import json

import requests

from resources.conf import *

header = {"content-type": "application/json"}

def run():
    content = {"message": random.choice(messages), "country": random.choice(countries)}
    r = requests.post(url, data=json.dumps(content), headers=header)
    print("enviado")
    return r.status_code

def daemon():
    while True:
        m = run()
        print(m)
        time.sleep(5)

try:
    daemon()
except:
    print("error demonio excepcion")
