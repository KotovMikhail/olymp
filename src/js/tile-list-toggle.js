const classNames = {
  toggleLink: `playbill-page-header__switch-button`,
  toggleLinkActive: `playbill-page-header__switch-button--active`
};

if (document.querySelector(`.${classNames.toggleLink}`)) {
  const targetLink = document.querySelector(`.${classNames.toggleLink}:not(.${classNames.toggleLinkActive})`);

  const onTargetLinkClick = function(e) {
    e.preventDefault();
    const urlMatch = window.location.href.match(/^([^?]+\?)(.*?)?(#.*)?$/);

    window.location.href = urlMatch && urlMatch[2] ? `${targetLink.href}?${urlMatch[2]}` : targetLink.href;
  };

  targetLink.addEventListener('click', onTargetLinkClick);
}
