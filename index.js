$(document).ready(function(){
    var album = $('.album');
    var viewport = album.find('.viewport');
    $('.pre').click(function(){
        viewport.scrollLeft(viewport.scrollLeft()-viewport.width());
    });
    $('.next').click(function(){
        viewport.scrollLeft(viewport.scrollLeft()+viewport.width());
    });
});
