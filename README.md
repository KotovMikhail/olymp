# Header
Чтобы сделать вашу страницу активной в меню передайте ее название в миксин. Например:
```
+header('Участники')
```
Если верх черный и нужно адаптировать шапку
```
+header('Участники')(className='header--black')
```

# theater-olympiad

#### Для подключения фильтров на страницу:

- В pug-шаблоне страницы подключаем стили для кастомизации селектов в блок meta

		block meta
  	      link(href="libs/nice-select/nice-select.css", rel="stylesheet")`

- А также скриты библиотек и полифилл в блоке scripts

		block scripts
          script(src="https://unpkg.com/formdata-polyfill")
          script(src="libs/jquery/jquery-3.3.1.min.js")
          script(src="libs/nice-select/nice-select.js")
 
 - Работа фильтров подключается в файле main.js

		if (document.querySelector(`.filter`)) {
          new Filter();
          new FilterChange();
		}
        
 - Фильтр с кастомными селектами добавляется на страницу с помощью pug-миксина filter с двумя аргументами:
 	- json-данные вида:
            `{
            "name": "имя фильтра",
            "value": "Отображаемое на странице название фильтра",
            "options": [массив со значениями для элементов option фильтра]
            }`
    - дополнительное имя класса для переопределения стилей фильтра

			+filter(data.playbillFilterData, 'playbill-page-header')
            
 - Символьный фильтр добавляется на страницу с помощью pug-миксина character-filter с тремя аргументами:
 	- массив с символьными данными или число, если это фильтр дней месяца
 	- дополнительное имя класса для переопределения стилей фильтра
 	- (необязательный) сегодняшний день месяца в числовой форме, если это фильтр дней месяца 

			+character-filter(31, 'playbill', 13)
            
  - Для добавления блока с отображаемыми результатами выбора фильтра, после фильтра в разметке добавить миксин filter-results с двумя аргументами и pug-шаблон _filter-result-template в конец блока main 
  	- (необязательный) дополнительное имя класса для переопределения стилей фильтра
  	- (необязательный) текст в блоке
  	
    		+filter(data.playbillFilterData, 'playbill-page-header')
			  +filter-results('playbill-page-header', 'Санкт-Петербург')
          
          include components/_filter-result-template
