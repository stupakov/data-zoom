#!/usr/bin/env bash
sass --watch sass:public/stylesheets &
ruby -run -e httpd . -p5000
