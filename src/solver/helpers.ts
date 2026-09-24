export function log<T>(subject: T, suffix?: string): T {
    if (suffix !== undefined) {
        console.log(suffix, subject);
    }
    else {
        console.log(subject);
    }
    return subject;
}
