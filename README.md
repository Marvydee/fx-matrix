## FX Matrix

A currency converter that does slightly more than most.

**The cross-rate thing**  
Most converters make one API call per pair. This one fetches USD base
rates once and derives every other pair from that using:

    GBP/NGN = (USD→NGN) / (USD→GBP)

One call. All pairs.

**The chart**  
Built with raw SVG — polyline, polygon, circle. No Recharts, no Chart.js.
The tooltip finds the nearest data point by mapping the mouse X position
to an index in the data array.

**Setup**  
No API key needed. open.er-api.com is free and open.

    npm install && npm start

Stack: React · open.er-api.com · SVG  
Live: [#](#)
