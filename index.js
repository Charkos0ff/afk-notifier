const colors = require('colors')
const fs = require("fs")
const os = require("os")

const put = `C:/Users/${os.userInfo().username}/AppData/Roaming/.vimeworld/config`;

process.stdout.write(
    String.fromCharCode(27) + "]0;" + 'VW AFK Notifier' + String.fromCharCode(7)
);

async function getServer(){
    const fileContent = fs.readFileSync(put, "utf8").split("\n");
                        
    for (let i = 0; i != fileContent.length; i++) {
        type = fileContent[i].split(":");
        switch(type[0]){
            case 'username':
                username = type[1];
                //console.log(`[Debug] Username: ${username}`);
            break;
            case 'server':
                server = type[1];
                //console.log(`[Debug] Server: ${server}`);
            break; 
        }
    }
    return {username, server}
}

async function stringLog(){
    const log = `./last.txt`;
    return new Promise((resolve, reject) => {
        if(fs.existsSync(log)){
            fs.readFile(log, "utf8", (err, data) => {
                resolve(data)
            })
        }
    })

} 

async function check(){
    const userInfo = await getServer();
    let length = 19
    let log = process.env.APPDATA + '/.vimeworld/' + userInfo.server.toLowerCase().trim() +'/output-client.log';
    

    if(userInfo.server.trim() == 'Hoden' || userInfo.server.trim() == 'Wurst'){
        length = 10
        log = process.env.APPDATA + '/.vimeworld/' + userInfo.server.toLowerCase().trim() +'/logs/latest.log';
    }

    if(fs.existsSync(log)){
        fs.readFile(log, "utf8", async (err, data) => {
            const logString = await stringLog();
            let delim = data.split("\n");
            let string = delim[delim.length-2];
            if(logString == string) return;

            fs.open("last.txt", "w", (err) => {
                fs.appendFile(
                  "last.txt",
                  string,
                  (err) => {
                    if (err) throw err;
                  }
                );
            });
                if(string.indexOf(`* ${userInfo.username.trim()} отошел`) !== -1){
                    let t = ``;
                    for(i = 0; i !== length; i++){
                        t += string[i]
                    }
                    console.log("\x07");
                    console.log(`${t} Вам пришло уведомление об АФК, самое время возобновить активность, иначе через 5 минут Вы будете кикнуты!`.red)    
                }
            
        });
    }
    else{
        console.log(`</> Файл логов отсутствует. Если Вы уверены, что это ошибка - попробуйте перезапустить программу от имени Администратора.`.red)
    }
}

async function art(){
    /*ASCII Art */
 
    console.log(`##########################################################\n`.brightBlue)
    console.log('   _____  _______________  __.  _______          __  .__  _____.__     '.blue)
    console.log('  /  _  \\ \\_   _____/    |/ _|  \\      \\   _____/  |_|__|/ ____\\__| ___________ '.blue)
    console.log(' /  /_\\  \\ |    __) |      <    /   |   \\ /  _ \\   __\\  \\   __\\|  |/ __ \\_  __ \\'.blue)
    console.log('/    |    \\|     \\  |    |  \\  /    |    (  <_> )  | |  ||  |  |  \\  ___/|  | \\/'.blue)
    console.log('\\____|__  /\\___  /  |____|__ \\ \\____|__  /\\____/|__| |__||__|  |__|\\___  >__|   '.blue)
    console.log('        \\/     \\/           \\/         \\/                              \\/      '.blue)
    console.log(`\n################# Coded by CharkosOff <3 #################`.brightBlue)
}

async function start(){
    /*art*/
    art()
    /* О программе */
    console.log(`\nПривет! Эта программа отправляет вам уведомление, когда Вы слишком долго находитесь в АФК на Модовых серверах`.brightBlue)
    console.log(`Вся необходимая информация (никнейм, сервер) будут собраны автоматически`.brightBlue)
    /* Начало поиска */
    console.log(`\n</> Приступаю к проверке чата`.blue)
    await setInterval(async function () {
        check()
    }, 100);
}


start()
