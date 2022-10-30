
// Dynamic navigation menu design.
const activepage=window.location.pathname;
const linkItems = document.querySelectorAll(".link-item");
linkItems.forEach((linkItem, index) => {
    if (linkItem.href.includes(`${activepage}`)){ 
      // Checking if the site is active now
            document.querySelector(".active").classList.remove("active");
            linkItem.classList.add("active");
            const indicator = document.querySelector(".indicator");
            var x = window.matchMedia("(max-width: 728px)")
            if (x.matches) { // If media query matches
              //Moving the pointer to a site location for a small screen
                indicator.style.right = `${index * 80 + 10}px`;
              } else {
                //Moving the pointer to the position on the site for a large screen
                indicator.style.right = `${index * 240 + 60}px`;
              }
           
    }
})





function GetLocation() {
  console.log(navigator.geolocation);
  if (navigator.geolocation) {
      console.log("in get location");
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      document.getElementById("p").innerHTML = "על מנת לשתמש באתר אלייך לאשר שימוש במיקומך הנוכחי";
  }
};

function showPosition(position) {
  var x = document.getElementById('lat');
  var z = document.getElementById('lon');
  x.value =  position.coords.latitude; 
  z.value =  position.coords.longitude;
  console.log("Latitude: " + position.coords.latitude 
  + "longtitide: " + position.coords. longitude);
}

