
#Сборка и запуск портала
Данный проект находится в GIT репозитарии
<%=repoUrl %><%= portalName %>.git

## Загрузка проекта
Необходимо создать папку проекта в директории {projects_dir}
Допустим
    md rosreestr
Перейдите в папку
    cd rosreestr
И выполните
    git clone https://git.egron.net:8443/git/portal/rosreestr/inner.git
После чего загрузятся необходимые для проекта каталоги

## Установка NodeJS
Для начала работы нам необходимо установить NodeJS. Дистрибутив можно скачать с сервера
http://nodejs.org/ или установить через репозиторий программ:
- для винды из http://chocolatey.org/ командой
    cinst nodejs
- для ubuntu, mint
    sudo apt-get install python-software-properties python g++ make
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs

## Установка Grunt
Для начала работы нам необходимо установить командный интерфейс GruntJS как глобальную библиотеку NPM (пакетного менеджера NodeJS)
командой:
    npm install -g grunt-cli
Более подробно про установку http://gruntjs.com/getting-started

## Установка Bower
Для загрузки библиотек javascript необходимо подключить репозитарий bower.io
    npm install -g bower
Более подробно про установку http://bower.io/

## Установка библиотек grunt
Далее необходимо в текущем каталоге проекта выполнить команду:
    npm install

После выполнения данных команды  появится каталог
  node_modules

## Загрузка зависимых компонент
Зависимости представлают из себя:
Глобальные компоненты bower(в репозитории bower.io)
Локальные компоненты bower, которые хранятся в https://git.egron.net:8443/git/portal/
- к ним относятся mod.core, mod.auth, mod.sidebar и т.п
Есть локальные папки
- к ним относятся mod.info, template.base

Из текущего каталог необходимо выполнить
    grunt cmpBower


Более подробно про работу с компонентами описано
https://www.npmjs.org/package/grunt-cmp-builder


## Сборка проекта и запуск сервера
Из текущего каталога необходимо выполнить команду:
    grunt server
Если у вас установлен chrome, то откроется главная страница портала,
если не установлен, зайдите в вашем браузере на страницу
    http://localhost:9000/


### Возможно выполнить сборку портала без запуска сервера.
Для это вместо grunt server, необходимо выполнить grunt cmpBuild
По умолчанию сборка осуществляется в каталог build

А базовые параметры для сборки беруться из корневого файла cmp.json

    {
        "name": "portal.rr",
        "watch": "app.arm",
        "dependencies": {
            "jquery": "=2.0.3",
            "angular": "~1.2.1",
            "angular-ui-router": "~0.2.0",
            "angular-bootstrap": "~0.6.0",
            "template.base": "~0.1.1",
            "mod.info": "./mod.info",
            "app.arm": "./app.arm",
        }
    }

Здесь указаны зависимые компоненты которые необходимо собирать при сборке портала
( если не указан параметра для grunt cmpBuild,
  напримере так grunt cmpBuild:mod.info - будет собрана только одна компонента вместе с его зависимостями )


### Команда grunt server запускает ряд задач
    grunt.registerTask('server', [
        'clean:all',
        'cmpBower',
        'cmpBuild',
        'configureProxies:server',
        'connect:server',
        'open:server',
        'watch:app:app.usecases'
    ]);

    'clean:all' - очистка каталога сборки проекта (./build)
    'cmpBower' - подгрузка зависимых компонент (внутри испозльзует api bower.io)
    'cmpBuild' - рекурсивная сборка компонент проекта
    'configureProxies:server' - конфигурация прокси сервера, для работы с REST сервисами
    'connect:server' - запуск web сервера node connect
    'open:server' - открытие главной страница портала в браузере по умолчнанию
    'watch:app' - постоянное отслеживания одного из приложений портала, при разработке.
    (название приложения указано в поле watch корневого файла cmp.json )

Если это не сделать то изменения сделанные в приложения отображаться в браузере (т.е пересобираться автоматически не будут)


### Для ускорения сборки портала, возможно каталог build сделать как ссылку на виртуальный каталог в памяти.
С этой целью на OC Windows можно использовать:
 http://www.softperfect.com/products/ramdisk/
 и mklink.bat (для создания ссылки)

