import { defineToolbarApp } from "astro/toolbar";

export default defineToolbarApp({
  init(canvas) {
    const windowElement = document.createElement("astro-dev-toolbar-window");

    const links = [
      { link: "https://flyo.cloud", text: "Flyo Cloud Login" },
      {
        link: "https://dev.flyo.cloud/nitro/",
        text: "Flyo Nitro Developer Portal",
      },
      {
        link: "https://nitro-openapi.flyo.cloud/",
        text: "Flyo Nitro API Documentation",
      },
    ];

    const content = links
      .map(
        (link) =>
          `<astro-dev-toolbar-card link="${link.link}" style="margin-bottom:8px;">
          ${link.text}
        </astro-dev-toolbar-card>`
      )
      .join("");
    windowElement.innerHTML = content;
    canvas.appendChild(windowElement);
  },
});
