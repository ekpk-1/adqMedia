/** One round trip for everything the site renders. Photos are Sanity images. Films are paths in public/. */
export const CONTENT_QUERY = `{
  "projects": *[_type == "project"] | order(coalesce(order, 9999) asc, title asc) {
    title,
    "slug": slug.current,
    category,
    location,
    date,
    "client": client->{ "id": slug.current, name },
    info,
    credits,
    "cover": cover.asset->{ url, "width": metadata.dimensions.width, "height": metadata.dimensions.height },
    "coverAlt": cover.alt,
    coverVideo { src, poster, width, height, duration, alt },
    rows[] {
      type,
      slots[] {
        kind,
        alt,
        width,
        height,
        duration,
        src,
        poster,
        "imageUrl": image.asset->url,
        "imageWidth": image.asset->metadata.dimensions.width,
        "imageHeight": image.asset->metadata.dimensions.height,
        "imageAlt": image.alt
      }
    }
  },
  "clients": *[_type == "client"] | order(name asc) {
    "id": slug.current,
    name,
    short,
    wordmark,
    url,
    "logo": logo.asset->url
  },
  "settings": *[_id == "siteSettings"][0] {
    email,
    phone,
    location,
    socials,
    showreel { title, caption, src, poster, width, height, duration },
    info {
      statement,
      facts,
      aboutLead,
      aboutBody,
      contactIntro,
      "stillCaption": still.caption,
      "still": still.asset->{ url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
    },
    services[] {
      id,
      audience,
      title,
      chip,
      pitch,
      youGet,
      where,
      "image": image.asset->{ url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
    }
  }
}`;
