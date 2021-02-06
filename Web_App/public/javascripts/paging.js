(function($) {
    $(function() {
        $.widget("zpd.paging", {
            options: {
                limit: 10,
                rowDisplayStyle: 'block',
                activePage: 0,
                rows: []
            },
            _create: function() {  	
                $( ".paging-nav" ).remove()   
                var rows = $("tbody", this.element).children();
                this.options.rows = rows;
                this.options.rowDisplayStyle = rows.css('display');
                var nav = this._getNavBar();
                this.element.after(nav);
                this.showPage(this.options.activePage);
            },
            _getNavBar: function() {
                var rows = this.options.rows;
                var nav = $('<div>', {class: 'paging-nav'});
                var last = Math.ceil(rows.length / this.options.limit)
                console.log("Numero paginas = " + last)
                console.log("Atual = " + this.options.activePage)
                var actual = this.options.activePage
                if (actual + 6 > last){
                    for (i; i < last; i++) {
                        this._on($('<a>', {
                            href: '#',
                            text: (i + 1),
                            "data-page": (i)
                        }).appendTo(nav),
                                {click: "pageClickHandler"});
                    }
                }
                else {
                    for (actual; actual < (actual + 6); i++) {
                        this._on($('<a>', {
                            href: '#',
                            text: (i + 1),
                            "data-page": (i)
                        }).appendTo(nav),
                                {click: "pageClickHandler"});
                    }
                }
                //create previous link
                this._on($('<a>', {
                    href: '#',
                    text: '<<',
                    "data-direction": -1
                }).prependTo(nav),
                        {click: "pageStepHandler"});
                //create next link
                this._on($('<a>', {
                    href: '#',
                    text: '>>',
                    "data-direction": +1
                }).appendTo(nav),
                        {click: "pageStepHandler"});
                return nav;
            },
            showPage: function(pageNum) {
                var num = pageNum * 1; //it has to be numeric
                this.options.activePage = num;
                var rows = this.options.rows;
                var limit = this.options.limit;
                for (var i = 0; i < rows.length; i++) {
                    if (i >= limit * num && i < limit * (num + 1)) {
                        $(rows[i]).css('display', this.options.rowDisplayStyle);
                    } else {
                        $(rows[i]).css('display', 'none');
                    }
                }
            },
            pageClickHandler: function(event) {
                event.preventDefault();
                $(event.target).siblings().attr('class', "");
                $(event.target).attr('class', "selected-page");
                var pageNum = $(event.target).attr('data-page');
                this._create();
                this.showPage(pageNum);
            },
            pageStepHandler: function(event) {
                event.preventDefault();
                //get the direction and ensure it's numeric
                var dir = $(event.target).attr('data-direction') * 1;
                var pageNum = this.options.activePage + dir;
                //if we're in limit, trigger the requested pages link
                if (pageNum >= 0 && pageNum < this.options.rows.length) {
                    $("a[data-page=" + pageNum + "]", $(event.target).parent()).click();
                }
            }
        });
    });
})(jQuery);