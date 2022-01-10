cd D:\ws\blog2020\babelfishchat\client
call ncu
cd D:\ws\blog2020\babelfishchat\server
call checkdep

cd D:\ws\blog2020\capacitor-push\client
call ncu
cd D:\ws\blog2020\capacitor-push\server
call checkdep

cd D:\ws\blog2020\chat\client
call ncu
cd D:\ws\blog2020\chat\server
call checkdep

cd D:\ws\blog2020\cryptochat\client
call ncu
cd D:\ws\blog2020\cryptochat\server
call checkdep

cd D:\ws\blog2020\geophotos\app
call ncu
cd D:\ws\blog2020\geophotos\extract
call checkdep

cd D:\ws\blog2020\hashupgrade\argon2
call checkdep
cd D:\ws\blog2020\hashupgrade\jooq
call checkdep
cd D:\ws\blog2020\hashupgrade\md5
call checkdep

cd D:\ws\blog2020\hCaptcha\basic
call checkdep
cd D:\ws\blog2020\hCaptcha\ionic
call ncu

cd D:\ws\blog2020\jsengine
call checkdep

cd D:\ws\blog2020\locationvideo
call ncu

cd D:\ws\blog2020\nebular-start
call ncu

cd D:\ws\blog2020\protobuf-js2\client
call ncu
cd D:\ws\blog2020\protobuf-js2\server
call checkdep

cd D:\ws\blog2020\rxjs-websocket\client
call ncu
cd D:\ws\blog2020\rxjs-websocket\server
call checkdep


cd D:\ws\blog2020\golambda\arm\infra
call make upgrade-libraries
cd D:\ws\blog2020\golambda\arm\lambda
call make upgrade-libraries
cd D:\ws\blog2020\golambda\cloudwatch_cleanup\infra
call make upgrade-libraries
cd D:\ws\blog2020\golambda\cloudwatch_cleanup\lambda
call make upgrade-libraries
cd D:\ws\blog2020\golambda\helloworld\infra
call make upgrade-libraries
cd D:\ws\blog2020\golambda\helloworld\lambda
call make upgrade-libraries
