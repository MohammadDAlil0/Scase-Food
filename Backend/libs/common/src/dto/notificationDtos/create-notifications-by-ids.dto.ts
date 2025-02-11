/**
 * Data Transfer Object (DTO) for creating a notification.
 * 
 * @property usersId - The IDs of the users who will recieve the message.
 * @property title - The title of the message.
 * @property description - The content of the message.
 */
export class CreateNotificationsByIdsDto {
    /**
     * The IDs of the users who will recieve the message.
     */
    usersId: [string];

    /**
     * The title of the message.
     */
    title: string;

    /**
     * The content of the message.
     */
    description: string;
}
