/**
 * Data Transfer Object (DTO) for creating a notification.
 * 
 * @property userId - The ID of the user who will recieve the message.
 * @property title - The title of the message.
 * @property description - The content of the message.
 */
export class CreateNotificationDto {
    /**
     * The ID of the user who will recieve the message.
     */
    userId: string;

    /**
     * The title of the message.
     */
    title: string;

    /**
     * The content of the message.
     */
    description: string;
}
