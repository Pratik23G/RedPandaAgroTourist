/**
 * Photo library. Photos with a `credit` come from Wikimedia Commons under the license shown
 * (CC BY / CC BY-SA require visible attribution: rendered on /gallery). Photos with no credit
 * are the owner's own. Swap any of these for the owner's real photos by replacing the file.
 */
export interface Photo {
  src: string;
  alt: string;
  credit?: { author: string; license: string; url: string };
}

export const photos = {
  "red-panda-langtang": { src: "/images/photos/red-panda-langtang.jpg", alt: "A curious red panda in Langtang National Park", credit: { author: "Sunuwargr", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Curious_Red_Panda_in_Langtang_National_Park.jpg" } },
  "red-panda-cub": { src: "/images/photos/red-panda-cub.jpg", alt: "A red panda cub clinging to a moss-covered branch", credit: { author: "Sunuwargr", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Curious_Red_Panda_Cub_in_Langtang_National_Park.jpg" } },
  "red-panda-tree": { src: "/images/photos/red-panda-tree.jpg", alt: "A red panda chewing bamboo against green foliage", credit: { author: "Mathias Appel", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Red_Panda_(24986761703).jpg" } },
  "red-panda-portrait": { src: "/images/photos/red-panda-portrait.jpg", alt: "A red panda perched on a forest branch", credit: { author: "Mathias Appel", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Ailurus_fulgens_(red_panda).jpg" } },
  "kanchenjunga-tumling": { src: "/images/photos/kanchenjunga-tumling.jpg", alt: "The Kanchenjunga range seen from Tumling", credit: { author: "Satadru306", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Kanchendzonga_range_from_Tumling.jpg" } },
  "tumling-trail": { src: "/images/photos/tumling-trail.jpg", alt: "Sunlit trail along the Tumling ridge", credit: { author: "Satadru306", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Sunkissed_Trail_of_Tumling.jpg" } },
  "kanchenjunga-sandakphu": { src: "/images/photos/kanchenjunga-sandakphu.jpg", alt: "Kanchenjunga at dusk from Sandakphu", credit: { author: "Joyindia2017", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Kanchenjunga_from_Sandakphu.jpg" } },
  "landrover-singalila": { src: "/images/photos/landrover-singalila.jpg", alt: "An old Land Rover on the track through Singalila National Park", credit: { author: "Alexkom000", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:2024-03-10_Old_Land_Rover_in_Singalila_National_Park_1.jpg" } },
  "landrover-singalila-2": { src: "/images/photos/landrover-singalila-2.jpg", alt: "A vintage Land Rover climbing a rocky Singalila track", credit: { author: "Alexkom000", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:2024-03-10_Old_Land_Rover_in_Singalila_National_Park_2.jpg" } },
  "singalila-forest": { src: "/images/photos/singalila-forest.jpg", alt: "Mist among the trees of Singalila National Park", credit: { author: "Alexkom000", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:2024-03-10_Singalila_National_Park_8.jpg" } },
  "kala-pokhri": { src: "/images/photos/kala-pokhri.jpg", alt: "Kala Pokhri lake strung with prayer flags, Singalila", credit: { author: "Joyindia2017", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Kala_Pokhri_Lake,_Singalila_National_Park.jpg" } },
  "ilam-tea": { src: "/images/photos/ilam-tea.jpg", alt: "Tea gardens rolling through the clouds at Ilam", credit: { author: "Pravinchapagain", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Ilam_tea_garden.jpg" } },
  "ilam-hills": { src: "/images/photos/ilam-hills.jpg", alt: "Green hillside village above Ilam", credit: { author: "Hari gurung77", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Ilam_nepal_0002.jpg" } },
  "rhododendron": { src: "/images/photos/rhododendron.jpg", alt: "Rhododendrons in bloom in a Himalayan forest", credit: { author: "Nr221", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Rhododendron_Forest-Annapurna_Conservation_area.jpg" } },
  "everest": { src: "/images/photos/everest.jpg", alt: "Mount Everest and Nuptse in the Himalayas", credit: { author: "Vyacheslav Argenberg", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Everest,_Himalayas.jpg" } },
  "village-terraces": { src: "/images/photos/village-terraces.jpg", alt: "Terraced farmland and homes on a Nepali hillside", credit: { author: "Bijay Chaurasia", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Terrace_Farming_in_Nepal_in_Rakathum_VDC-0375.jpg" } },
  "village-life": { src: "/images/photos/village-life.jpg", alt: "Farming village life in rural Nepal", credit: { author: "Anuja Sharma", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Nepal_village_life.jpg" } },
  "camping": { src: "/images/photos/camping.jpg", alt: "A tent pitched under snow peaks in the Himalaya", credit: { author: "Ksuryawanshi", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Camping_in_the_himalaya.jpg" } },
  "owl": { src: "/images/photos/owl.jpg", alt: "A Himalayan wood owl in a mossy forest", credit: { author: "Shiv's fotografia", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Himalayan_wood_owl.jpg" } },
  "swayambhu": { src: "/images/photos/swayambhu.jpg", alt: "Swayambhunath stupa with prayer flags, Kathmandu", credit: { author: "Vyacheslav Argenberg", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Swayambhu,_Kathmandu,_Nepal.jpg" } },
  "sandakphu-village": { src: "/images/photos/sandakphu-village.jpg", alt: "Mountain lodges at Sandakphu", credit: { author: "Alexkom000", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:2024-03-10_Sandakphu_village_1.jpg" } },
  "owner-red-panda": { src: "/images/redP.jpg", alt: "A red panda spotted on the Singhalila ridge" },
  "owner-lake": { src: "/images/lakeylakes.jpeg", alt: "Alpine lake along the Singhalila ridge trail" },
  "owner-prayer-flags": { src: "/images/prayerFlag.jpeg", alt: "Prayer flags strung at a Himalayan viewpoint" },
  "owner-road": { src: "/images/tumling-road.jpg", alt: "The winding road up to the misty hillside village at Tumling" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
