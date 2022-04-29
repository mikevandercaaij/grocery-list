exports.getDay = () => {
    const today = new Date();
    const options = {
        weekday: "long",
    };

    const day = today.toLocaleDateString("en-US", options);

    switch (day) {
        case "Monday":
            return "Maandag";
        case "Tuesday":
            return "Dinsdag";
        case "Wednesday":
            return "Woensdag";
        case "Thursday":
            return "Donderdag";
        case "Friday":
            return "Vrijdag";
        case "Saturday":
            return "Zaterdag";
        case "Sunday":
            return "Zondag";
    }
};
