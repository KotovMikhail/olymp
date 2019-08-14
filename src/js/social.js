const createSocials = (parent) => {
  let selector;

  if (parent) {
    selector = `[data-id='${parent.dataset.id}'] .rambler-share`;
  } else {
    selector = `.rambler-share`;
  }

  const init = () => {
    RamblerShare.init(selector, {
      'style': {
        'buttonHeight': 36,
        'borderRadius': 0,
        'buttonBackground': '#bbae92'
      },
      'utm': 'utm_medium=social',
      'counters': true,
      'buttons': [
        'vkontakte',
        'facebook',
        'twitter',
        'copy'
      ]
    });
  };


  const script = document.createElement('script');
  script.onload = init;
  script.async = true;
  script.src = 'https://developers.rambler.ru/likes/v1/widget.js';

  parent
  ? parent.appendChild(script)
  : document.head.appendChild(script);
};

export default createSocials;
