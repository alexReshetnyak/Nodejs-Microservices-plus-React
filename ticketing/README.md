Install dependencies instruction

# DOCKER

## DOCKER usage steps:

- (optional) list all images: `docker images -a`
- (optional) Remove all dangling images. If -a is specified, will also remove all images not referenced by any container: `docker image prune -a`
- (optional) Remove all dangling containers `docker container prune`
- (optional) Prune everything `docker system prune`
- (optional) remove image by id: `docker rmi image_id`
- (optional) list all containers: `docker ps -a`
- (optional) remove container by id: `docker rm container_id`
- to create image move to one of services folder and: `docker build .`
- (optional) create image with tag: `docker build -t alexreshetnyak/posts .`
- create and run container:
  - with tag: `docker run -it --rm -p 3001:3000 -e CHOKIDAR_USEPOLLING=true alexreshetnyak/client`
  - with tag: `docker run alexreshetnyak/posts`
  - with id: `docker run 54788ec314ca`
  - with shell: `docker run -it alexreshetnyak/posts sh`
- start created container: `docker start 54788ec314ca`
- (optional) execute bash command inside docker container: `docker exec -it 54788ec314ca sh`
- (optional) show logs from container: `docker logs 54788ec314ca`

# KUBERNETES for linux

## Install kubectl:

- `sudo apt-get update && sudo apt-get install -y apt-transport-https`
- `curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -`
- `echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list`
- `sudo apt-get update`
- `sudo apt-get install -y kubectl`

## Install virtualbox:

Download and install deb from [link](https://www.virtualbox.org/wiki/Linux_Downloads)

## Install minikube:

- `curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \ && chmod +x minikube`
- `sudo mkdir -p /usr/local/bin/`
- `sudo install minikube /usr/local/bin/`

## Verify minikube setup:

- `minikube start --vm-driver=virtualbox`
- `minikube status`
- `minikube stop`
- (optional) `minikube delete`
- `kubectl version`

## Create pod:

`docker build -t alexreshetnyak/posts .`
`docker push alexreshetnyak/posts`
`cd infra/k8s`
`kubectl apply -f posts-depl.yaml`
(optional, apply changes for entire folder) `kubectl apply -f .`
`kubectl rollout restart deployment posts-depl`

## Update pod:

Once after pc start: `minikube start --vm-driver=virtualbox`
Once after pc start: `eval $(minikube docker-env)`
`docker build -t alexreshetnyak/posts .`
`docker push alexreshetnyak/posts`
`kubectl describe pod posts-depl`
`kubectl rollout restart deployment posts-depl`

## Control pod:

`kubectl delete pods posts-depl`
`kubectl get pods`
`kubectl get deployments`
`kubectl describe pod posts-depl`
`kubectl describe deployment posts-depl`
`kubectl exec -it posts-depl sh`
`kubectl logs posts-depl`

## Create NodePort Service:

`kubectl apply -f posts-srv.yaml`
`kubectl get services`
`kubectl describe service posts-srv`
To access service - <minikube ip>:<NodePort_for_posts-srv>/posts
If you are running Minikube locally, use minikube ip to get the external IP: `minikube ip`
(use command `minikube service posts-srv --url` result: http://192.168.99.100:31725)

## Install Helm and NGINX Ingress Controller:
`curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3`
`chmod 700 get_helm.sh`
`./get_helm.sh`

`helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`
`helm install alexey-release ingress-nginx/ingress-nginx`
(optional) Verify: `kubectl get services`

If you need to deal with Server Side Rendering (SSR) and send a HTTP request from one pod (where your Next.js App is running) to one of your microservice (that is running in a different pod), before the page is even rendered, you can send the request to http://alexey-release-ingress-nginx-controller.default.svc.cluster.local

## Create ClusterIP Service:

add posts clusterip-srv to posts-depl.yaml and `kubectl apply -f posts-depl.yaml`

## Install ingress-nginx:

Enable ingress: `minikube addons enable ingress`
Apply ingress config: `kubectl apply -f ingress-srv.yaml`
modify /etc/hosts, add to bottom: 192.168.99.100 posts.com

## Next.js, 
### Sending http request from kubernetes pod through ingress service to another pod in Minikube
You'll need Helm to install NGINX Ingress Controller, 
where you can replace alexey-release with whatever you like:
`helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`
`helm install alexey-release ingress-nginx/ingress-nginx`
Check the available services in the default namespace: `kubectl get services`
Now we have alexey-release-ingress-nginx-controller service of type LoadBalancer. 
If you need to deal with Server Side Rendering (SSR) and send a HTTP request from one pod 
(where your Next.js App is running) to one of your microservices (that is runnig in a different pod), before the page is even rendered, you can send the request to 
http://alexey-release-ingress-nginx-controller.default.svc.cluster.local
/<path_set_in_the_Ingress_Resource>. 
For example the URL can looks like: 
http://alexey-release-ingress-nginx-controller.default.svc.cluster.local/api/users

## Install skaffold:

`curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64`
`sudo install skaffold /usr/local/bin/`
`skaffold dev`

# TICKETING APP

### Run minikube

`minikube start --vm-driver=virtualbox`
`eval $(minikube docker-env)`

## Auth service

Build image `docker build -t alexreshetnyak/auth .`
Push image to docker hub `docker push alexreshetnyak/auth`
Run skaffold `skaffold dev`
modify /etc/hosts, add to bottom: 192.168.99.100 ticketing.dev
to store jwt secret: `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=***`
(optional) to list all created keys: `kubectl get secrets`
(optional) run tests `npm run test`

## Client
Install dependencies `npm i`
(optional) Start application `npm run dev`
Build image `docker build -t alexreshetnyak/client .`
Push image to docker hub `docker push alexreshetnyak/client`
Run skaffold `skaffold dev`
(optional) Get kubectl namespaces `kubectl get namespace`
(optional) Verify the IP address is set: `kubectl get ingress`

## Common packages
`npm login` and enter login/password (for example lehaincolor/******)
`npm init -y`, `git init`, `git add .`, `git commit -m "initial-commit`, 
`npm publish --access public`
next commits:  `npm version patch` and `npm publish`
install dependency: `npm i @alexey-corp/common`
update dependency: `npm update @alexey-corp/common`
