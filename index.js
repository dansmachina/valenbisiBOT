const Telegraf = require('telegraf');
const Geolib = require('geolib');
const GetJSON = require('get-json');
const Emoji = require('node-emoji');

const Token = '<token_here>'
const app = new Telegraf(Token);

app.command('start', (ctx) => {
    ctx.replyWithChatAction('typing');
    var nombre = ctx.from.first_name;
    var usuario = ctx.from.username;
    var reply = Emoji.emojify(':wave: ' + nombre + '\nSi quieres conocer tu estación de valenbisi más cercana, envíame tu localización.');
    ctx.reply(reply)
    console.log("[INFO] - /start command - " + usuario)
})
app.command('acerca_de', (ctx) => {
    ctx.replyWithChatAction('typing');
    ctx.reply(
        'Bot no oficial de valenbisi\n' +
        'Creado por @algope\n' +
        'http://alejandrogonzalez.me'
    )
})

app.on('message', (ctx) => {
    ctx.replyWithChatAction('typing');
    var nombre = ctx.from.first_name;
    var usuario = ctx.from.username;
    ctx.reply(Emoji.emojify(':wave: ' + nombre + '\nSi quieres conocer tu estación de valenbisi más cercana, envíame tu localización.'));
    console.log("[INFO] - rendom text - " + usuario)
});

app.hears('hola', (ctx) => ctx.reply('¡Hola!'))
app.hears('Hola', (ctx) => ctx.reply('¡Hola!'))

app.on('location', (ctx) => {
    ctx.replyWithChatAction('typing');
    var location = ctx.message.location
    console.log("[INFO] - location received - " + JSON.stringify(location))
    var bikes = 'https://api.citybik.es/v2/networks/valenbisi?fields=stations'
    GetJSON(bikes, function(error, response) {
        var geolibresp = Geolib.findNearest(location, response.network.stations, 0)
        var key = geolibresp.key;
        var estacion = response.network.stations[key];
        var latitud = estacion.latitude;
        var longitud = estacion.longitude;
        var direccion = estacion.extra.address;
        var huecos = estacion.empty_slots;
        var bicis = estacion.free_bikes;
        var estado = estacion.extra.status;
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
            ctx.replyWithChatAction('find_location')
            ctx.replyWithLocation(latitud, longitud).then(function() {
                if (bicis == '0') {
                    ctx.replyWithChatAction('typing');
                    ctx.reply(Emoji.emojify('Vaya, parece que no quedan bicis :white_frowning_face:')).then(function() {
                        var geolibresp2 = Geolib.findNearest(location, response.network.stations, 1)
                        var key2 = geolibresp2.key;
                        var estacion2 = response.network.stations[key2];
                        var latitud2 = estacion2.latitude;
                        var longitud2 = estacion2.longitude;
                        var direccion2 = estacion2.extra.address;
                        var huecos2 = estacion2.empty_slots;
                        var bicis2 = estacion2.free_bikes;
                        var estado2 = estacion2.extra.status;
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
                            ctx.replyWithChatAction('find_location')
                            ctx.replyWithLocation(latitud2, longitud2)
                        });

                    });
                } else if (huecos == '0') {
                    ctx.replyWithChatAction('typing');
                    ctx.reply(Emoji.emojify('Vaya, parece que no quedan huecos :white_frowning_face:')).then(function() {
                        var geolibresp3 = Geolib.findNearest(location, response.network.stations, 1)
                        var key3 = geolibresp3.key;
                        var estacion3 = response.network.stations[key3];
                        var latitud3 = estacion3.latitude;
                        var longitud3 = estacion3.longitude;
                        var direccion3 = estacion3.extra.address;
                        var huecos3 = estacion3.empty_slots;
                        var bicis3 = estacion3.free_bikes;
                        var estado3 = estacion3.extra.status;
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
                            ctx.replyWithChatAction('find_location')
                            ctx.replyWithLocation(latitud3, longitud3)
                        });
                    });
                }
            })
        })
    })
})

app.catch((err) => {
    console.log('[ERROR] - ', err)
})

app.startPolling()
