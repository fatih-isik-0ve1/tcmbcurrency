const axios = require("axios");
const parseString = require('xml2js').parseString;
const yargs = require('yargs');

const argv = yargs
    .option('currency', {
        alias: 'c',
        description: 'Currency Code',
        type: 'string'
    })
    .option('interval', {
        alias: 'i',
        description: 'Interval minute',
        type: 'number',
		default:0
    })
    .help()
    .alias('help', 'h')
    .argv;

const tcmbTodayXmlUrl = "https://www.tcmb.gov.tr/kurlar/today.xml";

if(argv.currency){
	process.stdout.write('\033c');
	const getCurrencyRate = function(){
		axios.get(tcmbTodayXmlUrl)
		.then(function(response){
			parseString(response.data, function (err, result) {
				let currencyObject = result.Tarih_Date.Currency.find(x=>x["$"].CurrencyCode==argv.currency);
				if(currencyObject)
					console.log(argv.currency + " : " + currencyObject.ForexBuying[0] + "TL - " + (new Date()).toLocaleTimeString());
				else
					console.error(argv.currency + " : not found");
			});
		});
	}
	getCurrencyRate();
	if(argv.interval>0)
	{
		setInterval(getCurrencyRate,argv.interval * 60 * 1000);
	}
}else{
	console.error("currency required");
}