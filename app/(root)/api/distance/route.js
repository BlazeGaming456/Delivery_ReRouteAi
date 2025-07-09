export async function POST(request) {
  try {
    const { origin, destination } = await request.json();
    console.log("Origin:", origin);
    console.log("Destination:", destination);

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error("Missing Google Maps API Key");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;
    console.log("Requesting URL:", url);

    const res = await fetch(url);
    const data = await res.json();
    console.log("Google API response:", JSON.stringify(data, null, 2));

    if (
      !data.rows ||
      !data.rows[0] ||
      !data.rows[0].elements ||
      !data.rows[0].elements[0].distance
    ) {
      throw new Error("Invalid response from Google API");
    }

    const distance = data.rows[0].elements[0].distance.text;
    const duration = data.rows[0].elements[0].duration.text;

    return Response.json({ distance, duration, success: true });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}