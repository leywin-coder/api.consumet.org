import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animekai = new ANIME.AnimeKai(process.env.ANIMEKAI_URL || 'https://animekai.to');

  fastify.get('/', (_, reply) => {
    return reply.status(200).send({
      intro: `Welcome to the animekai provider: check out the provider's website @ ${animekai.baseUrl}`,
      routes: [
        '/:query',
        '/latest-completed',
        '/new-releases',
        '/recent-added',
        '/schedule/:date',
        '/spotlight',
        '/search-suggestions/:query',
        '/info',
        '/watch/:episodeId',
        '/genre/list',
        '/genre/:genre',
        '/movies',
        '/ona',
        '/ova',
        '/specials',
        '/tv',
      ],
      documentation: 'https://docs.consumet.org/#tag/animekai',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { query } = request.params as { query: string };
      const { page } = request.query as { page?: number };
      const res = await animekai.search(query, page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/latest-completed', async (request, reply) => {
    try {
      const { page } = request.query as { page?: number };
      const res = await animekai.fetchLatestCompleted(page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/watch/:episodeId', async (request, reply) => {
    try {
      const { episodeId } = request.params as { episodeId: string };
      const { server, dub } = request.query as { server?: StreamingServers; dub?: string };
      const isDub = dub === 'true' || dub === '1';

      if (server && !Object.values(StreamingServers).includes(server)) {
        return reply.status(400).send({ message: 'Invalid server specified' });
      }

      const res = await animekai.fetchEpisodeSources(
        episodeId,
        server,
        isDub ? SubOrSub.DUB : SubOrSub.SUB
      );

      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/info', async (request, reply) => {
    try {
      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ message: 'id is required' });
      }

      const res = await animekai.fetchAnimeInfo(id);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/servers/:episodeId', async (request, reply) => {
    try {
      const { episodeId } = request.params as { episodeId: string };
      const { dub } = request.query as { dub?: string };
      const isDub = dub === 'true' || dub === '1';

      const res = await animekai.fetchEpisodeServers(
        episodeId,
        isDub ? SubOrSub.DUB : SubOrSub.SUB
      );

      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/genre/list', async (_, reply) => {
    try {
      const res = await animekai.fetchGenres();
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/genre/:genre', async (request, reply) => {
    try {
      const { genre } = request.params as { genre: string };
      const { page } = request.query as { page?: number };

      const res = await animekai.genreSearch(genre, page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/movies', async (request, reply) => {
    try {
      const { page } = request.query as { page?: number };
      const res = await animekai.fetchMovie(page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/ona', async (request, reply) => {
    try {
      const { page } = request.query as { page?: number };
      const res = await animekai.fetchONA(page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/ova', async (request, reply) => {
    try {
      const { page } = request.query as { page?: number };
      const res = await animekai.fetchOVA(page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/specials', async (request, reply) => {
    try {
      const { page } = request.query as { page?: number };
      const res = await animekai.fetchSpecial(page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });

  fastify.get('/tv', async (request, reply) => {
    try {
      const { page } = request.query as { page?: number };
      const res = await animekai.fetchTV(page);
      return reply.status(200).send(res);
    } catch (error) {
      return reply.status(500).send({ message: 'Something went wrong.', error });
    }
  });
};

export default routes;
