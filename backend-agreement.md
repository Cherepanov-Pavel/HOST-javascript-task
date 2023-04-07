We expect that backend will return the list of consumers is as follows
[
    {
        id: 1,
        name: 'Oksana',
        number: 89128376868,
        type: 1,
    },
    {
        id: 2,
        name: 'Joe',
        number: 88004699269,
        type: 2,
    }
]

We expect that backend will get this list of request params, when we want to add new consumer
?name=Павел&type=1&number=5325235235235

When we want to update consumer, we expect that backend will get the same parameters, but also with id
&id=2

When we want to delete consumer, we will send only id of new consumer.




When app will be ready to work with the real backend, need to do this steps:

1. in file js/config/Config.js need to set production variable to true value, and set base_url variable
2. in file js\config\path\Consumers.js need in all files set reals server urls and set types of requests