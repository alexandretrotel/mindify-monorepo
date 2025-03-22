import { fetchingSummaryRequests } from "@/ai-utils/requests/fetching-summary-requests";
import { checkAuthorExists } from "@/ai-utils/authors/check-author-exists";
import { generateAuthor } from "@/ai-utils/authors/generateAuthor";
import { insertingAuthor } from "@/ai-utils/authors/inserting-author";
import { checkSummaryExists } from "@/ai-utils/summaries/check-summary-exists";
import { generateSummary } from "@/ai-utils/summaries/generate-summary";
import { insertingChapters } from "@/ai-utils/chapters/inserting-chapters";
import { insertingSummary } from "@/ai-utils/summaries/inserting-summary";
import { generateMinds } from "@/ai-utils/minds/generate-minds";
import { insertingMinds } from "@/ai-utils/minds/inserting-minds";
import { deletingSummaryRequest } from "@/ai-utils/requests/deleting-summary-request";

export async function generateSummaries() {
  const data = await fetchingSummaryRequests();

  let successfulSummaries = 0;
  let failedSummaries = 0;
  const failedTitles = [];

  for (const summaryRequest of data) {
    console.log("Generating summary for request", summaryRequest);

    try {
      let authorDataGlobal;
      let summaryDataGlobal;

      console.log("Checking author exists:", summaryRequest.author);
      console.log("\n");
      const authorExistsObject = await checkAuthorExists(summaryRequest.author);

      if (!authorExistsObject.exists) {
        console.log("Author not found, generating author");
        const authorObject = await generateAuthor(summaryRequest.author);

        console.log("Inserting author:", authorObject);
        console.log("\n");
        const authorData = await insertingAuthor(
          authorObject.author,
          authorObject.description
        );
        authorDataGlobal = authorData;
      } else {
        console.log("Author found:", authorExistsObject.data);
        console.log("\n");
        authorDataGlobal = authorExistsObject.data;
      }

      console.log("Checking summary exists:", summaryRequest.title);
      console.log("\n");
      const summaryExistsObject = await checkSummaryExists(
        summaryRequest.title
      );

      if (!summaryExistsObject.exists) {
        console.log("Summary not found, generating summary");
        const summaryObject = await generateSummary(
          summaryRequest.title,
          summaryRequest.author
        );

        console.log("Inserting chapters:", summaryObject.chapters);
        console.log("\n");
        const chapters = await insertingChapters(summaryObject.chapters);

        const summaryObjectForLogs = {
          readingTime: summaryObject.readingTime,
          chapters: chapters,
          source: summaryRequest.source,
          author: authorDataGlobal?.id,
          topic_id: summaryRequest.topic_id,
          title: summaryRequest.title,
        };

        console.log("Inserting summary", summaryObjectForLogs);
        console.log("\n");
        const summaryData = await insertingSummary(
          summaryRequest.title,
          summaryRequest.topic_id,
          authorDataGlobal?.id,
          chapters?.id,
          summaryRequest.source,
          summaryObject.readingTime
        );

        summaryDataGlobal = summaryData;
      } else {
        console.log("Summary found:", summaryExistsObject.data);
        console.log("\n");
        summaryDataGlobal = summaryExistsObject.data;
      }

      console.log("Generating minds for summary");
      const mindsObject = await generateMinds(
        summaryRequest.title,
        summaryRequest.author
      );

      console.log("Inserting minds");
      await insertingMinds(mindsObject, summaryDataGlobal?.id);

      console.log("Deleting summary request");
      await deletingSummaryRequest(summaryRequest.id);

      console.log(
        "Successfully generated minds for summary request",
        summaryRequest
      );

      successfulSummaries++;
    } catch (error) {
      console.error("Error while generating summary", error);
      console.log("\n");

      failedSummaries++;
      failedTitles.push(summaryRequest.title);

      continue;
    }
  }

  const successPercentage = ((successfulSummaries / data.length) * 100).toFixed(
    2
  );

  console.log("\nSummary Generation Statistics:");
  console.log(`Total summaries: ${data.length}`);
  console.log(
    `Successful summaries: ${successfulSummaries} (${successPercentage}%)`
  );
  console.log(`Failed summaries: ${failedSummaries}`);
  console.log("Failed summaries titles:", failedTitles);
}
