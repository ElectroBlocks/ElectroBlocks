import type { Lesson, Step } from "./lesson.model";

export default class InAppTutorialFeter {
  public static readonly WEBCOMPONENT_TAG_NAME = "website-nglesson";

  public static readonly CHANGE_LESSON_EVENT = "nglesson-change";

  public static readonly BASE_URL =
    "https://firestore.googleapis.com/v1/projects/inapp-tutorial/databases/(default)/documents";

  constructor(private organization: string) {
    if (window && document) {
      document.addEventListener("nglesson-close", () => {
        const element = document.querySelector("website-nglesson");

        if (element) {
          element.remove();
        }
      });
    }
  }

  /**
   * This will get one lesson
   */
  async getLesson(id: string, withSteps = false) {
    try {
      const requestLesson = await fetch(
        `${InAppTutorialFeter.BASE_URL}/organizations/${this.organization}/lessons/${id}`
      );
      const lessonJSON = await requestLesson.json();
      if (!withSteps) {
        const id = lessonJSON.name.split("/").pop();
        return { ...this.parseJSON(lessonJSON), id };
      }

      const requestSteps = await fetch(
        `${InAppTutorialFeter.BASE_URL}/organizations/${this.organization}/lessons/${id}/steps`
      );

      let steps = [];
      const stepsJSON = await requestSteps.json();
      if (stepsJSON.documents) {
        steps = stepsJSON.documents
          .map((step: Step) => {
            return this.parseJSON(step);
          })
          .sort((a, b) => a.stepNumber - b.stepNumber);
      }

      const lesson = this.parseJSON(lessonJSON) as Lesson<any>;
      lesson.steps = steps;
      lesson.id = lessonJSON.name.split("/").pop();
      return lesson;
    } catch (e) {
      this.onError(e, "getLesson");
    }
  }

  /**
   * This will get all the lessons for a organization
   */
  async getLessons() {
    try {
      const requestLesson = await fetch(
        `${InAppTutorialFeter.BASE_URL}/organizations/${this.organization}/lessons`
      );

      const json = await requestLesson.json();
      return json.documents.map((lesson) => {
        const id = lesson.name.split("/").pop();
        return { ...this.parseJSON(lesson), id };
      });
    } catch (e) {
      this.onError(e, "getLessons");
    }
  }

  /**
   * This will get a list of lessons with the steps for a page
   */
  public async getLessonsByPage(pageName: string): Promise<Lesson<any>[]> {
    try {
      const requestOrg = await fetch(
        `${InAppTutorialFeter.BASE_URL}/organizations/${this.organization}`
      );

      const jsonOrg = await requestOrg.json();
      console.log(jsonOrg, "jsonOrg");
      const page = jsonOrg.fields.pages.mapValue.fields[pageName];

      if (!page) {
        return [];
      }

      return await Promise.all(
        page.mapValue.fields.lessonIds.arrayValue.values.map((obj) => {
          return this.getLesson(obj.stringValue);
        })
      );
    } catch (e) {
      this.onError(e, "getLessonsByPage");
    }
  }

  /**
   * This will open the tutorial with the lesson id
   */
  public async open(x: number, y: number, lessonId: string): Promise<void> {
    const json = await this.getLesson(lessonId, true);

    let webcomponentEl = document.querySelector(
      InAppTutorialFeter.WEBCOMPONENT_TAG_NAME
    );
    if (!webcomponentEl) {
      this.createWebComponent(x, y);
    }

    const event = new Event(InAppTutorialFeter.CHANGE_LESSON_EVENT);
    (event as any).detail = json;
    document.dispatchEvent(event);
  }

  /**
   * Creates the webcomponent
   */
  private createWebComponent(x: number, y: number): void {
    const webcomponent = document.createElement(
      InAppTutorialFeter.WEBCOMPONENT_TAG_NAME
    );
    webcomponent.setAttribute("left", x.toString());
    webcomponent.setAttribute("top", y.toString());
    document.body.append(webcomponent);
  }

  /**
   * This will parse most things expect arrays and maps
   */
  private parseJSON(json: Object | any) {
    const object = {};
    for (let fieldName in json.fields) {
      for (let datatype in json.fields[fieldName]) {
        const value = json.fields[fieldName][datatype];
        object[fieldName] = datatype === "integerValue" ? +value : value;
      }
    }
    return object;
  }

  /**
   * Meant for global error handling.
   */
  private onError(e: Error, funcName: string) {
    console.log("ERROR_FUNCTION_NAME", funcName);
    console.log(e, "ERROR");
  }
}
