import * as express from "express";
import {
  deleteAllNotificationsSchema,
  deleteParticularNotificationAdminSchema,
  deleteParticularNotificationUserSchema,
  getAllAdminNotificationsSchema,
  getAllNotificationsSchema,
  IGetAllAdminNotificationsPaginated,
  IGetAllNotificationsPaginated,
  IUpsertNotificationAdmin,
  toggleSeenNotificationsSchema,
  upsertNewNotificationAdminSchema,
} from "../../dtos/notifications/v1/notifcations-validators";
import { checkIfAuthenticated } from "../../middlewares/checkIfAuthenticated.middleware";
import { validateIncomingRequest } from "../../middlewares/validateIncomingRequest.middleware";
import NotificationControllerV1 from "../controllers/notificationController.v1";
/**
 * @swagger
 * tags:
 *  name: Notifications
 *  description: Notifications related APIS. You can establish web socket connections via using listed domains as a source and we are following socket.io implementations. Inside of the handshake query you have to pass the userId that you get after logging in to the system like so {"id" ":" "userId"}
 * */
/**
 * @swagger
 * tags:
 *  name: Notifications_Admin
 *  description: Notifications related APIs for Admin Only
 * */

/**
 * @swagger
 * components:
 *      schemas:
 *           Notification Categories:
 *                            type: string
 *                            description: Possible notification topics you are going to see
 *                            enum: ["dealAdded", "dealUpdated", "couponAdded", "couponUpdated", "loyaltyPointsEarned","others","register","orderConfirmation","orderPending","orderReceived","orderProcessing","newOrder"]
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Pagination:
 *                                 type: object
 *                                 properties:
 *                                        currentPage:
 *                                               type: number
 *                                               default: 1
 *                                        totalPages:
 *                                               type: number
 *                                               default: 1
 *                                        perPage:
 *                                               type: number
 *                                               default: 1
 *                                        total:
 *                                               type: number
 *                                               default: 1
 *          Notification:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: string
 *                              description: If the intentTo of the notification is INDIVIDUAL then the userId will be populated here
 *                          outletChainId:
 *                              type: string
 *                          isSeen:
 *                              type: boolean
 *                              description: Will be toggled if the intent to is INDIVIDUAL
 *                          intentTo:
 *                              type: string
 *                              default: "ALL|INDIVIDUAL"
 *                          fromAdmin:
 *                              type: boolean
 *                              description: It will be true if the notification is sent from admin
 *                          blacklistedFor:
 *                               type: object
 *                               description: If a user deletes a notification and the intentTo of the notification is ALL then the id of the user will appear here in a KeyValue Pair
 *                          seenBy:
 *                                type: object
 *                                description: If a user sees a notification and the intentTo of the notification is ALL the id of the user will appear here in a KeyValue Pair
 *                          notificationInfo:
 *                              type: object
 *                              properties:
 *                                 title:
 *                                      type: string
 *                                      default: "Title of the notification"
 *                                 highlights:
 *                                      type: string
 *                                      default: "Some info regarding the notification"
 *                                 topic:
 *                                      type: string
 *                                      default: "others"
 *                                 details:
 *                                      type: string
 *                                      default: "<h1>Hello World</h1>"
 *                                 imageUrl:
 *                                      type: string
 *                                      nullable: true
 *                                      default: "https://www.google.com"
 *                                 meta:
 *                                      type: object
 *                                      description: topic related data will be inserted here
 */
class NotificationV1 {
  public path = "/v1/notifications";
  public router = express.Router();
  public notificationController: NotificationControllerV1;

  constructor() {
    this.notificationController = new NotificationControllerV1();
    this.router.post(`${this.path}/dummy`, this.GetDummyResponse);
    this.router.post(
      `${this.path}/dummy-persisted`,
      this.GetDummyResponsePersisted
    );
    this.router.get(
      `${this.path}/users-paginated`,
      validateIncomingRequest(getAllNotificationsSchema),
      this.GetUsersNotificatyionsPaginated
    );

    this.router.get(
      `${this.path}/admin-paginated`,
      checkIfAuthenticated,
      validateIncomingRequest(getAllAdminNotificationsSchema),
      this.GetAdminNotificationsPaginated
    );
    this.router.delete(
      `${this.path}/deleteall-for-users`,
      validateIncomingRequest(deleteAllNotificationsSchema),
      this.DeleteAllNotificationsForUser
    );
    this.router.patch(
      `${this.path}/toggle-seen-for-users`,
      validateIncomingRequest(toggleSeenNotificationsSchema),
      this.ToggleSeenNotificationsForUser
    );

    this.router.delete(
      `${this.path}/delete-notification`,
      validateIncomingRequest(deleteParticularNotificationUserSchema),
      this.DeleteParticularNotificationsForUser
    );

    this.router.put(
      `${this.path}/upsert-admin-notification`,
      checkIfAuthenticated,
      validateIncomingRequest(upsertNewNotificationAdminSchema),
      this.UpsertNotificationAdmin
    );

    this.router.delete(
      `${this.path}/admin-delete-notification`,
      checkIfAuthenticated,
      validateIncomingRequest(deleteParticularNotificationAdminSchema),
      this.DeleteParticularNotificationsForAdmin
    );
  }

  /**
   * @swagger
   * /v1/notifications/dummy:
   *  post:
   *      tags:
   *          - Notifications
   *      summary: Get a dummy response when any notification related events happen through web sockets. EVENT NAME IS "RECEIVE_NOTIFICATION".Changes WILL NOT BE saved in database
   *      parameters:
   *        - in: query
   *          name: id
   *          type: string
   *          required: false
   *          description: ID used to connect with this socket endpoint
   *      responses:
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                       $ref: '#/components/schemas/Notification'
   *
   * */
  private GetDummyResponse = async (
    req: express.Request,
    res: express.Response
  ) => {
    const id = (req.query?.id ?? "testing") + "";
    const isSent = await this.notificationController.sendDummyNotification(id);
    if (isSent) {
      return res.status(200).send("Message will be sent");
    } else {
      return res.status(500).send("Unable to send message");
    }
  };

  /**
   * @swagger
   * /v1/notifications/dummy-persisted:
   *  post:
   *      tags:
   *          - Notifications
   *      summary: Get a dummy response when any notification related events happen through web sockets. EVENT NAME IS "RECEIVE_NOTIFICATION".Changes WILL BE saved in database
   *      parameters:
   *        - in: query
   *          name: id
   *          type: string
   *          required: false
   *          description: ID used to connect with this socket endpoint
   *      responses:
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      $ref: '#/components/schemas/Notification'
   *
   * */
  private GetDummyResponsePersisted = async (
    req: express.Request,
    res: express.Response
  ) => {
    const id = (req.query?.id ?? "testing") + "";
    const isSent =
      await this.notificationController.sendDummyNotificationPersisted(id);
    if (isSent) {
      return res.status(200).send("Message will be sent");
    } else {
      return res.status(500).send("Unable to send message");
    }
  };

  /**
   * @swagger
   * /v1/notifications/users-paginated:
   *  get:
   *      tags:
   *          - Notifications
   *      summary: Get paginated response of all notifications for a particular user
   *      parameters:
   *        - in: query
   *          name: userId
   *          type: string
   *          required: true
   *          description: ID of the user
   *        - in: query
   *          name: limit
   *          type: number
   *          required: false
   *          default: 100
   *          description: how many entries will be there per page. default 100
   *        - in: query
   *          name: page
   *          type: number
   *          required: true
   *          default: 1
   *          description: No of desired page, MUST BE A POSTIVE NUMBER
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    notifications:
   *                                           type: array
   *                                           items:
   *                                               $ref: '#/components/schemas/Notification'
   *                                    paginationData:
   *                                           $ref: '#/components/schemas/Pagination'
   *
   * */
  private GetUsersNotificatyionsPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let queryData: IGetAllNotificationsPaginated = {
      ...req.query,
      userId: (req.query?.userId ?? "") + "",
    };
    console.log("Query data is: ", queryData);
    let data =
      await this.notificationController.getPaginatedNotificationsForUsers(
        queryData
      );
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/notifications/admin-paginated:
   *  get:
   *      tags:
   *          - Notifications_Admin
   *      summary: Get paginated response of all notifications for admin
   *      parameters:
   *        - in: query
   *          name: search
   *          type: string
   *          required: false
   *          description: Search term
   *        - in: query
   *          name: limit
   *          type: number
   *          required: false
   *          default: 100
   *          description: how many entries will be there per page. default 100
   *        - in: query
   *          name: page
   *          type: number
   *          required: true
   *          default: 1
   *          description: No of desired page, MUST BE A POSTIVE NUMBER
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    notifications:
   *                                           type: array
   *                                           items:
   *                                               $ref: '#/components/schemas/Notification'
   *                                    paginationData:
   *                                           $ref: '#/components/schemas/Pagination'
   *
   * */
  private GetAdminNotificationsPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let queryData: IGetAllAdminNotificationsPaginated = {
      ...req.query,
      outletChainId: (req as any)?.extracted?.outletChainID as string,
    };
    let data =
      await this.notificationController.getPaginatedNotificationsForAdmin(
        queryData
      );
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/notifications/deleteall-for-users:
   *  delete:
   *      tags:
   *          - Notifications
   *      summary: Delete All notifications for a particular user
   *      parameters:
   *        - in: query
   *          name: userId
   *          type: string
   *          required: true
   *          description: ID of the user
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *
   *
   * */
  private DeleteAllNotificationsForUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.notificationController.deleteAllUsersNotification(
      (req.query?.userId ?? "") + ""
    );
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/notifications/toggle-seen-for-users:
   *  patch:
   *      tags:
   *          - Notifications
   *      summary: Toggle seen status of all notifications for a particular user
   *      parameters:
   *        - in: query
   *          name: userId
   *          type: string
   *          required: true
   *          description: ID of the user
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *
   *
   * */
  private ToggleSeenNotificationsForUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.notificationController.toggleSeen(
      (req.query?.userId ?? "") + ""
    );
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/notifications/delete-notification:
   *  delete:
   *      tags:
   *          - Notifications
   *      summary: Delete particular notification for a particular user
   *      parameters:
   *        - in: query
   *          name: userId
   *          type: string
   *          required: true
   *          description: ID of the user
   *        - in: query
   *          name: notificationId
   *          type: string
   *          required: true
   *          description: _id of the notification
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *          '404':
   *              description: Notification not found
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *
   *
   * */
  private DeleteParticularNotificationsForUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data =
      await this.notificationController.deleteNotificationForParticularUser({
        userId: (req.query?.userId ?? "") + "",
        notificationId: (req.query?.notificationId ?? "") + "",
      });
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/notifications/admin-delete-notification:
   *  delete:
   *      tags:
   *          - Notifications_Admin
   *      summary: Delete notification sent from admin side
   *      parameters:
   *        - in: query
   *          name: notificationId
   *          type: string
   *          required: true
   *          description: _id of the notification
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *          '404':
   *              description: Notification not found
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *
   *
   * */
  private DeleteParticularNotificationsForAdmin = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.notificationController.deleteNotificationForAdmin({
      outletChainId: (req as any)?.extracted?.outletChainID as string,
      notificationId: (req.query?.notificationId ?? "") + "",
    });
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /oca/login:
   *  post:
   *      tags:
   *          - Admin
   *      summary: Login as admin
   *      requestBody:
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            email:
   *                                type: string
   *                                default: "BloomsForWellness@gmail.com"
   *                            password:
   *                                type: string
   *                                default: '123456'
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *          '404':
   *              description: Notification not found
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *
   *
   * */
  /**
   * @swagger
   * /v1/notifications/upsert-admin-notification:
   *  put:
   *      tags:
   *          - Notifications_Admin
   *      summary: Send Notifications to all users
   *      parameters:
   *        - in: query
   *          name: notificationId
   *          type: string
   *          required: false
   *          description: ID of the notification
   *      requestBody:
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            title:
   *                                type: string
   *                            highlights:
   *                                type: string
   *                            details:
   *                                type: string
   *                            viaEmail:
   *                                type: boolean
   *                            viaSystem:
   *                                type: boolean
   *                            viaSms:
   *                                type: boolean
   *                            viaMobile:
   *                                type: boolean
   *
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *          '404':
   *              description: Notification not found
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *
   *
   * */
  private UpsertNotificationAdmin = async (
    req: express.Request,
    res: express.Response
  ) => {
    let params: IUpsertNotificationAdmin = {
      outletChainId: (req as any)?.extracted?.outletChainID as string,
      query: {
        notificationId: req.query?.notificationId
          ? req.query?.notificationId + ""
          : undefined,
      },
      body: {
        viaEmail: req.body?.viaEmail,
        viaMobile: req.body?.viaMobile,
        viaSms: req.body?.viaSms,
        viaSystem: req.body?.viaSystem,
        title: req.body?.title ? req.body?.title : "",
        highlights: req.body?.highlights,
      },
    };
    let data = await this.notificationController.upsertNotificationAdmin(
      params
    );
    return res.status(data.statusCode).send(data.toSend);
  };
}

export default NotificationV1;
