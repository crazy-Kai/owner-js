
var activeCls = 'active'
$(function() {
    var $myContent = $('.legalcourt-content')
    var $titles = $myContent.find('.title')

    $titles.on('click', function(e) {
        var $this = $(this)
        var re = /arrow([rb])\.jpg$/
        var $img = $this.find('img')
        var $overview = $this.next('.overview')
        var active = $overview.hasClass(activeCls)
        if(active){
            $overview.removeClass(activeCls)
            $img.attr('src',function(index,val){
                return val.replace(re,'arrowr.jpg')
            })
        }else{
            $overview.addClass(activeCls)
            $img.attr('src',function(index,val){
                return val.replace(re,'arrowb.jpg')
            })
        }
    })
})
