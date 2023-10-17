FROM public.ecr.aws/sam/build-python3.8:1
RUN mkdir -p /usr/src/staff-service/
WORKDIR /usr/src/staff-service/
COPY . /usr/src/staff-service/
RUN pip install -r requirements.txt
