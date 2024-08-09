/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F9F7F7",
        secondary:"#DBE2EF",
        accent:"#3F72AF",
        accent1:"#112D4E",
        backgeound:"#EBEBEB"
        // primary: "#27374D",
        // secondary:"#526D82",
        // accent:"#9DB2BF",
        // accent1:"#DDE6ED",
    

  }}},
  plugins: [  ],
}

