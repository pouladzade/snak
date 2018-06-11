var path = require('path');
var fs   = require('fs');

const LogLevel = {
    fatal:'FATAL',
    error:'ERROR',
    warning:'WARNING',
    info:'INFO',
    debug:'DEBUG',    
    console:'CONSOLE'
}

module.exports = class Logger{
    
    constructor(filePath){
        this.write     = console.log; 
        
        if(filePath === undefined || filePath === null || filePath === ""){
            this.logLevel  = LogLevel.info;     
        }        
        else{
            this.logLevel  = LogLevel.info;            
            filePath = path.normalize(filePath);
            this.stream = fs.createWriteStream(filePath,{flags: 'a', encoding: 'utf8', mode:666});
            this.stream.write("\n");
            this.write = function(text) { this.stream.write(text); }; 
        }
    }

    _format () {
        let date = new Date().toISOString().replace(/T/, ' \t').replace(/\..+/, '');
        return '\n\n[ ' + this.logLevel + ' ]' + ' [' + date + ']';
    };
      
    _log(message,isFormat){   
        try{
            if(isFormat){     
                this.write(this._format());
            }
            if(typeof message === 'string' || typeof message === 'String')
                this.write(message);  
            else{
                this.write(JSON.stringify(message,null,4)); 
            }  
            
            this.write("\n");
        }  
        catch(ex){
            console.log(ex);
        }
       
    };

    fatal(message){
        this.logLevel  = LogLevel.info; 
        this._log(message,true);
    }

    error(message){
        this.logLevel  = LogLevel.error; 
        this._log(message,true);
    }

    warn(message){
        this.logLevel  = LogLevel.warning; 
        this._log(message,true);
    }

    info(message){
        this.logLevel  = LogLevel.info; 
        this._log(message,true);
    }

    debug(message){
        this.logLevel  = LogLevel.debug; 
        this._log(message,true);
    }

    console(message){
        this.logLevel  = LogLevel.console;         
        this._log(message,false);
    }
    
}


