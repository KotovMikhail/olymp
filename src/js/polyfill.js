if (!Element.prototype.closest) {
  Element.prototype.closest = function(selector) {
    const searchElement = function(elem) {
      const parent = elem.parentNode;

      if (!parent) {
        return null;
      }

      const isElemExist = Array.from(parent.querySelectorAll(selector)).some((it) => {
        return it === elem;
      });

      if (isElemExist) {
        return elem;
      }

      return (searchElement(parent));
    };

    return searchElement(this);
  };
}
