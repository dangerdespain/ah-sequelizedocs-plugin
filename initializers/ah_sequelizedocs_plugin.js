var _ = require('underscore');
var path = require('path');
var fs = require('fs');

var ah_sequelizedocs_plugin = function(api, next){ 
  
  var init = function(){
    _.each(api[api.config.sequelizedocs.apiPath], function(model, key){
      var hasValues = false;
      var attributes = [];
      var readmeFile = fs.createWriteStream(api.projectRoot + api.config.sequelizedocs.docsPath + key + '.md', {
        flags: "w",
        encoding: "null",
        mode: 0744
      })
      readmeFile.write('### ' + key + '\n');
      readmeFile.write('\n');
      readmeFile.write('#### Attributes \n');
      
      _.each(model.rawAttributes, function(attribute, key){
        var params = {
          key : key,
          required : ' ',
          defaultValue : ' ',
          typeName : ' ',
          values : ' '
        }

        if(!_.isUndefined(attribute.allowNull) && attribute.allowNull === false){
          params.required = 'yes';
        }

        if(!_.isUndefined(attribute.defaultValue)){
          params.defaultValue = attribute.defaultValue;
        }

        if(_.isString(attribute)){
          params.attribute = attribute;
        }else if(_.isString(attribute._typeName)){
          params.typeName = attribute._typeName;
        }else if(_.isString(attribute.type)){
          params.typeName = attribute.type;
        }else if(_.isString(attribute.type.type)){
          params.typeName = attribute.type.type;
        }else if(_.isString(attribute.type._typeName)){
          params.typeName = attribute.type._typeName;
        }

        if(!_.isUndefined(attribute.values)){
          params.values = attribute.values
          hasValues = true;
        }

        attributes.push(params);
      })

      readmeFile.write('| attribute | type | required | default |');
      if(hasValues){
        readmeFile.write(' values |');
      }
      readmeFile.write('\n')
      readmeFile.write('|----------|:-------------:|------|------|');
      if(hasValues){
        readmeFile.write('------|');
      }
      readmeFile.write('\n')

      _.each(attributes, function(attribute){
        readmeFile.write('| ' + attribute.key + ' | ' + attribute.typeName + ' | ' + attribute.required + ' | ' + attribute.defaultValue + ' |');
        if(hasValues){
          readmeFile.write(' ' + attribute.values + ' |');
        }
        readmeFile.write('\n')
      })

      readmeFile.write('\n');
      readmeFile.write('#### Associations \n');
      _.each(model.associations, function(association, key){
        readmeFile.write(association.source.name + ' ' + association.associationType + ' ' + association.target.name + '<br>\n');
      })
    })
  };
  init();
  next();
}

/////////////////////////////////////////////////////////////////////
// exports
exports.ah_sequelizedocs_plugin = ah_sequelizedocs_plugin;