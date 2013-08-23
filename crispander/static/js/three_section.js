
//funcion para deslizar las tres secciones de la vista page
function changePosition(position){
    if(position == 1)
    {
        $("#three_section").animate({scrollTop: 0}, 500);
    }
    else if(position == 2)
    {
        $("#three_section").animate({scrollTop: 405}, 500);
    }
    else
    {
        $("#three_section").animate({scrollTop: 1100}, 500);
    }
}
