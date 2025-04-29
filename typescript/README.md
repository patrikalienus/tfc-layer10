# Notes

## Install and test the functionality:
1. `npm run install`
2. `npm run start` will output the result of the test data in index.ts (`const dates`).

That's pretty much it.

If you run `npm run dev` you'll start a web server at http://localhost:5173/. Here you can enter whatever dates and times you want and test the functionality that way.  
This was WAY out of scope for this little test, so web.ts is 100% vibe-coded. I.e. I didn't write any of it - I just wanted an interface that was easy to test edge-cases in.


# requirements:
- Fees will differ between 9 SEK and 22 SEK, depending on the time of day. (Note: Added 16 SEK as well as per Transportstyrelsens definitions)
- The maximum fee for one day is 60 SEK.
- Only the highest fee should be charged for multiple passages within a 60 minute period.
- Some vehicle types are fee-free.
- Fee-free days are; Saturdays, Sundays, holidays and day before holidays and the whole month of July. See https://transportstyrelsen.se/sv/vagtrafik/Trangselskatt/Trangselskatt-i-goteborg/Tider-och-belopp-i-Goteborg/ for more information.



