// Data Structure for Patristic Library
const db = {
    fathers: [
        {
            id: "ignatius-antioch",
            name: "Ignatius of Antioch",
            dates: "c. 35 – c. 107 AD",
            bio: "Ignatius of Antioch was an early Christian writer and bishop of Antioch. En route to Rome, where he met his martyrdom, Ignatius wrote a series of letters. This correspondence now forms a central part of the later collection known as the Apostolic Fathers.",
            works: [
                {
                    id: "epistle-to-polycarp",
                    title: "Epistle to Polycarp",
                    type: "epistle",
                    path: "pages/fathers/ignatius/epistle-to-polycarp.html"
                }
            ]
        },
        {
            id: "cyril-alexandria",
            name: "Cyril of Alexandria",
            dates: "376 - 444 AD",
            bio: "Patriarch of Alexandria who played a central role in the Council of Ephesus and the defense of the title Theotokos for Mary.",
            works: [
                {
                    id: "on-adoration",
                    title: "On Adoration and Worship in Spirit and Truth",
                    type: "treatise",
                    path: "pages/fathers/cyril-alexandria/works/index.html"
                }
            ]
        },
        {
            id: "severus-antioch",
            name: "Severus of Antioch",
            dates: "465 - 538 AD",
            bio: "Patriarch of Antioch and a leading theologian of the Miaphysite church, known for his extensive homilies and letters.",
            works: [
                {
                    id: "critique-tome-julian",
                    title: "Critique of the Tome of Julian",
                    type: "treatise",
                    path: "pages/fathers/severus-antioch/Critique of the Tome of Julian.html"
                },
                {
                    id: "against-propositions-julian",
                    title: "Against the Propositions of Julian",
                    type: "treatise",
                    path: "pages/fathers/severus-antioch/Against the Propositions of Julian.html"
                },
                {
                    id: "cathedral-homilies",
                    title: "Cathedral Homilies",
                    type: "homily",
                    path: "pages/fathers/severus-antioch/Cathedral Homilies/index.html"
                }
            ]
        },
        {
            id: "polycarp",
            name: "Polycarp of Smyrna",
            dates: "69 – 155 AD",
            bio: "Polycarp was a 2nd-century Christian bishop of Smyrna. According to the Martyrdom of Polycarp, he died a martyr, bound and burned at the stake, then stabbed when the fire failed to consume his body.",
            works: []
        },
        {
            id: "justin-martyr",
            name: "Justin Martyr",
            dates: "100 – 165 AD",
            bio: "Justin Martyr was an early Christian apologist and philosopher. Most of his works are lost, but two apologies and a dialogue have survived. He was martyred, alongside some of his students, and is considered a saint by the Roman Catholic Church, the Anglican Communion, the Eastern Orthodox Church, and the Oriental Orthodox Churches.",
            works: []
        },
        {
            id: "irenaeus",
            name: "Irenaeus of Lyons",
            dates: "c. 130 – c. 202 AD",
            bio: "Irenaeus was a Greek bishop noted for his role in guiding and expanding Christian communities in the southern regions of present-day France and, more widely, for the development of Christian theology by combating heresy and defining orthodoxy.",
            works: []
        },
        {
            id: "john-chrysostom",
            name: "John Chrysostom",
            dates: "349 – 407 AD",
            bio: "Archbishop of Constantinople and an important Early Church Father. He is known for his eloquent preaching and public speaking, his denunciation of abuse of authority by both ecclesiastical and political leaders, and his Divine Liturgy of St. John Chrysostom.",
            works: [
                {
                    id: "commentary-on-job",
                    title: "Commentary on Job",
                    type: "commentary",
                    path: "pages/fathers/john-chrysostom/Commentary on Job/index.html"
                }
            ]
        },
        {
            id: "john-cassian",
            name: "John Cassian",
            dates: "360 – 435 AD",
            bio: "Christian monk and theologian celebrated in both the Western and Eastern churches for his mystical writings. He is known for bringing the ideas and practices of Christian monasticism to the early medieval West.",
            works: [
                {
                    id: "institutes",
                    title: "The Institutes",
                    type: "treatise",
                    path: "pages/fathers/john-cassian/The Institutes/index.html"
                }
            ]
        }
    ]
};

// Export for use in other modules (if using modules) or global access
window.patristicDB = db;
