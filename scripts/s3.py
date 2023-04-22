#!/usr/bin/env python3

from datetime import datetime
import subprocess

bucket_name = f's3://ec2-s3-role--{datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}'
file_name = "HelloWorld.txt" 

subprocess.run(["aws", "s3","mb",bucket_name], stderr=subprocess.PIPE, text=True)

with open(file_name, "w") as f:
    f.write("Hello, World! I am Donald Armando!!!")

subprocess.run(["aws", "s3","mv",file_name,bucket_name], stderr=subprocess.PIPE, text=True)