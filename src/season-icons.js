// Shared SVG artwork for the atmosphere controls and tool cursor.
const SeasonIcons = {
  autumn:
    '<path d="M19.5 3.5C12 3 5 6 5 12a6 6 0 0 0 6 6c6 0 8.5-7 8.5-14.5Z" fill="#d4a373" stroke="#9b693f"/><path d="M3.5 21 15 8.5m-7 8v-5m3 2 5-.5" stroke="#9b693f"/>',
  winter:
    '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M17 19l-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1"/>',
  spring:
    '<path d="M11 12C8 4 2 2 3 9c0 4 4 5 8 4-6 0-8 6-4 7 3 1 4-3 5-6m1-2c3-8 9-10 8-3 0 4-4 5-8 4 6 0 8 6 4 7-3 1-4-3-5-6" fill="#d1b9d3" stroke="#927c99"/><path d="M12 9v9m0-9-2-3m2 3 2-3" stroke="#756b67"/>',
  summer:
    '<circle cx="12" cy="12" r="5.5" fill="#edc778" stroke="#bc924a"/><path d="M12 1v1.5m0 19V23M1 12h1.5m19 0H23M4.2 4.2l1.1 1.1m13.4 13.4 1.1 1.1M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1" stroke="#bc924a"/>',
  none: '<path d="M12 2v9M6.5 5.5a8 8 0 1 0 11 0" stroke-width="1.8"/>',
  smooth:
    '<path d="M2 18c3 0 4-2 5-5 1-5 5-8 9-6-5 0-5 6-1 7 3 1 4-1 7-1v7H2Z" fill="#9fc7c5" stroke="#477f8b"/><path d="M3 21h18M11 10c1-2 3-3 5-3" stroke="#477f8b"/>',
  plant:
    '<path d="M12 21v-7m0 5c-3 0-5-2-5-4 3 0 5 2 5 4" stroke="#729474"/><g fill="#e6b5bf" stroke="#bb7e90" stroke-width="1"><path d="M12 11C7 8 8 3 11 3c2 0 3 4 1 8Z"/><path d="M12 11c1-6 6-8 7-5 1 2-2 5-7 5Z"/><path d="M12 11c6-1 9 3 6 5-2 2-5-1-6-5Z"/><path d="M12 11c3 5 0 9-3 7-2-1-1-5 3-7Z"/><path d="M12 11c-4 4-9 2-8-1 0-3 5-3 8 1Z"/></g><circle cx="12" cy="11" r="2.3" fill="#efd18a" stroke="#c09e55" stroke-width="1"/>',
  shovel:
    '<path d="M9 2h6v4a3 3 0 0 1-6 0Z" fill="#d2ac72" stroke="#866240"/><path d="M12 9v6" stroke="#866240" stroke-width="2.5"/><path d="M7 14h10v4c0 3-5 5-5 5s-5-2-5-5Z" fill="#9cbcc0" stroke="#547e88"/>',
  thaw: '<path d="M12 2C11 7 5 10 5 15a7 7 0 0 0 14 0c0-3-2-6-4-8 0 3-1 4-2 5 1-4-1-7-1-10Z" fill="#e9aa61" stroke="#b6773e"/><path d="M12 13c-1 2-3 4-3 5a3 3 0 0 0 6 0c0-1-2-3-3-5Z" fill="#b7dfe8" stroke="#608fa5"/>',
  breeze:
    '<path d="M2 7h14a3 3 0 1 0-3-3M2 12h20M2 17h14a3 3 0 1 1-3 3" stroke="#718b91" stroke-width="1.8"/>',
};
