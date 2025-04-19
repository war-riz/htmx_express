import express from "express";

const app = express();


// set static folder
app.use(express.static("public"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


// handle GET request to fetch all users
app.get("/api/users", async (req, res) => {
  // const users = [
  //   { id: 1, name: "John Doe" },
  //   { id: 2, name: "Jane Doe" },
  // ];

  const limit = +req.query.limit || 10;

  const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
  
  const users = await response.json();

  // send the users as JSON
  res.send(`
    <h2 class="text-2xl font-bold my-5">Users' list</h2>
    <ul>
      ${users
        .map(
          (user) => `<li class="text-lg my-2">${user.id}: ${user.name}</li>`
        )
        .join("")}
    </ul>`);
});

// handle POST request for temperature conversion
app.post("/api/convert", (req, res) => {
  const temperature = req.body.fahrenheit;

  let convertedCelsius;

  convertedCelsius = ((temperature - 32) * 5) / 9;

  res.send(
    `<h2 class="text-2xl font-bold">Converted Temperature</h2>
    <p class="text-lg my-2">${temperature}°$F is equal to ${convertedCelsius.toFixed(
      2
    )}°C</p>`
  );
});

let counter = 0;

// handle GET request for pooling
app.get("/api/poll", (req, res) => {
  counter++;

  const data = { value : counter };
  res.json(data);
})


let currentTemperature = 20;

// handle GET request for weather
app.get("/api/weather", (req, res) => {
  currentTemperature += Math.random() * 2 - 1; // Randomly increase or decrease the temperature

  res.send(
    `<h2 class="text-2xl font-bold">Current Temperature</h2>
    <p class="text-lg my-2">${currentTemperature.toFixed(2)}°C</p>`
  );
}
);

const contacts = [
  {name: "John Doe", email: "john@example.com"},
  {name: "Jane Doe", email: "jane@example.com"},
  {name: "Sam Smith", email: "sam@example.com"},
  {name: "Alice Johnson", email: "alice@example.com"},
  {name: "Bob Brown", email: "bob@example.com"},
  {name: "Charlie Black", email: "charlie@example.com"},
  {name: "Daisy White", email: "daisy@example.com"},
];

// // handle POST request for fecthing users' contacts
// app.post("/api/contacts", (req, res) => {
//   const searchTerm = req.body.search.toLowerCase();

//   if (!searchTerm) {
//     return res.status(400).send("<tr></tr>");
//   }

//   const searchResults = contacts.filter((contact) => {
//     const name = contact.name.toLowerCase();
//     const email = contact.email.toLowerCase();

//     return name.includes(searchTerm) || email.includes(searchTerm)
//   });

//     setTimeout(() => {
//       const searchResulltHTML = searchResults.map((contact) => {
//         return `<tr>
//           <td class="text-center px-6 py-2">${contact.name}</td>
//           <td class="text-center px-4 py-2">${contact.email}</td>
//         </tr>`;
//       }
//       ).join("");

//       res.send(searchResulltHTML);
//     }, 1000);
// });

// handle POST request for fecthing users' contacts
app.post("/api/contacts", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.status(400).send("<tr></tr>");
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm)
  });

    setTimeout(() => {
      const searchResulltHTML = searchResults.map((contact) => {
        return `<tr>
          <td class="text-center px-6 py-2">${contact.name}</td>
          <td class="text-center px-4 py-2">${contact.email}</td>
        </tr>`;
      }
      ).join("");

      res.send(searchResulltHTML);
    }, 1000);
});

// handle POST request for email validation
app.post("/api/validate-email", (req, res) => {
  const email = req.body.email;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValid = {
    message: "Valid email address",
    class: "text-green-500",
  };

  const isInvalid = {
    message: "Invalid email address",
    class: "text-red-500",
  };

  if (emailRegex.test(email)) {
    return res.send(`
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email Address</label
        >
        <input
          type="email"
          id="email"
          hx-post="/api/validate-email"
          name="email"
          value="${email}"
          class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          required
        />  
        <div class="text-sm ${isValid.class} mt-2">
          ${isValid.message}
      </div>
      `);
  } else {
    return res.send(`
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email Address</label
        >
        <input
          type="email"
          id="email"
          hx-post="/api/validate-email"
          name="email"
          value="${email}"
          class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          required
        />  
        <div class="text-sm ${isInvalid.class} mt-2">
          ${isInvalid.message}
      </div>
      `);
  }
}
);

// start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
}
);