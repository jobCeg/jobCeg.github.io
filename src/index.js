import "./index.scss";

import(/* webpackChunkName: 'globe'*/"./globe").then(({ Globe }) => {
  new Globe('#ff0513');
});
