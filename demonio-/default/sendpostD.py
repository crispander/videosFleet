#!/usr/bin/python
#-*- coding: utf-8 -*-

import time
import random
import json

import requests
from daemon import runner

from resources.conf import *

header = {"content-type": "application/json"}

class App():
    def __init__(self):
        self.stdin_path = '/dev/null'
        self.stdout_path = '/dev/tty'
        self.stderr_path = '/dev/tty'
        self.pidfile_path =  '/tmp/foo.pid'
        self.pidfile_timeout = 5
    def run(self):
        while True:
            content = {"message": random.choice(messages), "country": random.choice(countries)}

            r = requests.post(url, data=json.dumps(content), headers=header)
            time.sleep(5)

app = App()
daemon_runner = runner.DaemonRunner(app)
daemon_runner.do_action()
