const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

let accessToken: string | null = null

export async function getSpotifyToken() {
  if (accessToken) return accessToken

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`)
    },
    body: "grant_type=client_credentials"
  })

  const data = await res.json()
  accessToken = data.access_token
  return accessToken
}

export async function searchTracks(query: string) {
  const token = await getSpotifyToken()

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = await res.json()
  return data.tracks.items
}