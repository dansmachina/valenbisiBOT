const Telegraf = require('telegraf');
const Geolib = require('geolib');
const GetJSON = require('get-json');
const Emoji = require('node-emoji');

const Token = '<token>';
const app = new Telegraf(Token);

app.command('start', (ctx) => {
    ctx.replyWithChatAction('typing');
    let nombre = ctx.from.first_name;
    let usuario = ctx.from.username;
    let reply = Emoji.emojify(':wave: ' + nombre + '\nSi quieres conocer tu estación de valenbisi más cercana, envíame tu localización.');
    ctx.reply(reply);
    console.log("[INFO] - /start command - " + usuario)
});
app.command('acerca_de', (ctx) => {
    ctx.replyWithChatAction('typing');
    ctx.reply(
        'Bot no oficial de valenbisi\n' +
        'Creado por @algope\n' +
        'http://alejandrogonzalez.me'
    )
});

app.on('message', (ctx) => {
    ctx.replyWithChatAction('typing');
    let nombre = ctx.from.first_name;
    let usuario = ctx.from.username;
    ctx.reply(Emoji.emojify(':wave: ' + nombre + '\nSi quieres conocer tu estación de valenbisi más cercana, envíame tu localización.'));
    console.log("[INFO] - rendom text - " + usuario)
});

app.hears('hola', (ctx) => ctx.reply('¡Hola!'));
app.hears('Hola', (ctx) => ctx.reply('¡Hola!'));

app.on('location', (ctx) => {
    ctx.replyWithChatAction('typing');
    let location = ctx.message.location;
    console.log("[INFO] - location received - " + JSON.stringify(location));
    let bikes = 'https://api.citybik.es/v2/networks/valenbisi?fields=stations';
    GetJSON(bikes, function(error, response) {
        let geolibresp = Geolib.findNearest(location, response.network.stations, 0);
        let key = geolibresp.key;
        let estacion = response.network.stations[key];
        let latitud = estacion.latitude;
        let longitud = estacion.longitude;
        let direccion = estacion.extra.address;
        let huecos = estacion.empty_slots;
        let bicis = estacion.free_bikes;
        let estado = estacion.extra.status;
        if (estado == 'OPEN') {
            estado = Emoji.emojify(':white_check_mark:');
        } else {
            estado = Emoji.emojify(':x:');
        }
        ctx.reply(Emoji.emojify("La estación más cercana :information_source: \n" +
            " :arrow_forward:Ubicación: " + direccion + "\n" +
            " :arrow_forward:Estado: " + estado + "\n" +
            " :arrow_forward:Huecos: " + huecos + "\n" +
            " :arrow_forward:Bicis: " + bicis + "\n")).then(function() {
            ctx.replyWithChatAction('find_location');
            ctx.replyWithLocation(latitud, longitud).then(function() {
                if (bicis == '0') {
                    ctx.replyWithChatAction('typing');
                    ctx.reply(Emoji.emojify('Vaya, parece que no quedan bicis :white_frowning_face:')).then(function() {
                        let geolibresp2 = Geolib.findNearest(location, response.network.stations, 1);
                        let key2 = geolibresp2.key;
                        let estacion2 = response.network.stations[key2];
                        let latitud2 = estacion2.latitude;
                        let longitud2 = estacion2.longitude;
                        let direccion2 = estacion2.extra.address;
                        let huecos2 = estacion2.empty_slots;
                        let bicis2 = estacion2.free_bikes;
                        let estado2 = estacion2.extra.status;
                        if (estado2 == 'OPEN') {
                            estado2 = Emoji.emojify(':white_check_mark:');
                        } else {
                            estado2 = Emoji.emojify(':x:');
                        }
                        ctx.reply(Emoji.emojify("Aquí tienes otra estación cercana:\n" +
                            " :arrow_forward:Ubicación: " + direccion2 + "\n" +
                            " :arrow_forward:Estado: " + estado2 + "\n" +
                            " :arrow_forward:Huecos: " + huecos2 + "\n" +
                            " :arrow_forward:Bicis: " + bicis2 + "\n")).then(function() {
                            ctx.replyWithChatAction('find_location');
                            ctx.replyWithLocation(latitud2, longitud2)
                        });

                    });
                } else if (huecos == '0') {
                    ctx.replyWithChatAction('typing');
                    ctx.reply(Emoji.emojify('Vaya, parece que no quedan huecos :white_frowning_face:')).then(function() {
                        let geolibresp3 = Geolib.findNearest(location, response.network.stations, 1);
                        let key3 = geolibresp3.key;
                        let estacion3 = response.network.stations[key3];
                        let latitud3 = estacion3.latitude;
                        let longitud3 = estacion3.longitude;
                        let direccion3 = estacion3.extra.address;
                        let huecos3 = estacion3.empty_slots;
                        let bicis3 = estacion3.free_bikes;
                        let estado3 = estacion3.extra.status;
                        if (estado == 'OPEN') {
                            estado = Emoji.emojify(':white_check_mark:');
                        } else {
                            estado = Emoji.emojify(':x:');
                        }
                        ctx.reply(Emoji.emojify("Aquí tienes otra estación cercana:\n" +
                            " :arrow_forward:Ubicación: " + direccion3 + "\n" +
                            " :arrow_forward:Estado: " + estado3 + "\n" +
                            " :arrow_forward:Huecos: " + huecos3 + "\n" +
                            " :arrow_forward:Bicis: " + bicis3 + "\n")).then(function() {
                            ctx.replyWithChatAction('find_location');
                            ctx.replyWithLocation(latitud3, longitud3)
                        });
                    });
                }
            })
        })
    })
});

app.catch((err) => {
    console.log('[ERROR] - ', err)
});

app.startPolling();
