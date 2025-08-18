// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();


// public/js/script.js

// const fetchListings = async () => {
//     try {
//         // Agar aap server aur frontend same domain par hain
//         const res = await fetch("/listings"); 
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         console.log("Listings:", data);
//         // Optional: DOM me render karne ke liye function call
//         // renderListings(data);
//     } catch (err) {
//         console.error("Error fetching listings:", err);
//     }
// };

// fetchListings();
