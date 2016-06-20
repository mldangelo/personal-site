#!/bin/bash

# Script to kill running instances of site on port 7999

	pid=$(sudo netstat -tulpn | grep 7999 | grep node | tr '/' ' ' | awk '{print $7}')
	$(sudo kill -9 $pid)
	echo killed $pid
