const filterSearch = function(data) {
  const typesSearchResult = document.querySelectorAll(`.search-result__type`);
  data = data.split(`&`).map((item) => item.split(`=`));

  Array.from(typesSearchResult).forEach((it) => {
    const filterResult = it.closest(`.search-results__item`);

    if (data.length > 1) {
      const isInFilter = data.some((key) => {
        return key[0] === it.dataset.name;
      });

      filterResult.style.display = isInFilter ? `block` : `none`;
    } else {
      filterResult.style.display = `block`;
    }
  });
};

export default filterSearch;
