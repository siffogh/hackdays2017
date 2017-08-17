import cheerio from 'cheerio-without-node-native';
import _ from 'lodash/fp';

const compact = (arr) => {
  var a = [];
  for (var ay in arr) {
    if (arr[ay]) {
      a.push(arr[ay]);
    }
  }
  return a;
};


export const parseForm = ({ key, contextPath }) => {
    const EMBEDDED_KEY = 'embedded:'
    const APP_KEY = 'app:';

    let parsedKey = '';


    if (key.indexOf(EMBEDDED_KEY) === 0) {
      parsedKey = key.substring(EMBEDDED_KEY.length);
    }

    if (parsedKey.indexOf(APP_KEY) === 0) {
      if (contextPath) {
        parsedKey = compact([contextPath, parsedKey.substring(APP_KEY.length)])
          .join('/')
          .replace(/\/([\/]+)/, '/');
      }
    }

    return parsedKey;
  };

  export const getFormInputNames = (form) => {
    const $ = cheerio.load(form);
    return $('.form-control').get().map((tag) => tag.attribs.name).join(',');
  }

  export const getInjectedForm = (form, data) => {
    const $ = cheerio.load(form);

    return _.pipe(
      _.toPairs,
      _.each(([key, obj]) => $(`input[cam-variable-name="${key}"], select[cam-variable-name="${key}"]`).attr({value: obj.value, customtype: obj.type})),
      () => $(':root').html()
    )(data);

  }


  export const getFormData = (form) => {
    const $ = cheerio.load(form);
    const variablesArray = $('input, select').map((i,{attribs}) => ([[attribs['cam-variable-name'], {value: attribs.value, type: attribs.customtype} ]])).get();
    const variables = _.fromPairs(variablesArray);
    return ({variables});
  }

  export const addSubmitToForm = (form) => {
    const $ = cheerio.load(form);
    $('<input type="submit" value="complete" />').appendTo('form');
    return $(':root').html();
  }
