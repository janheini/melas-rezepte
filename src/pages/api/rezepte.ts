import { getCollection } from "astro:content";
import { tags } from "../../content/config.ts";

export async function POST({request}) {
    const formData = await request.formData();
    const val = formData.getAll("filter");

    let rezepte = await getCollection("rezepte");

    for (const v of val) {
        if (tags.parse(v)) {
            rezepte = rezepte.filter((rezept) => ( rezept.data.tags && rezept.data.tags.indexOf(v) > -1 ));
        }
    }
    const response = rezepte.map((rezept) => (`
                    <li>
                        <a href=${rezept.slug} class="no-underline hover:underline">
                            ${rezept.data.title}
                        </a>
                    </li>
                `)).join("");

    return new Response(response);
}
