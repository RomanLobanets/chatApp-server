import formatErrors from "../helpers/formatErrors";
import { requiersAuth } from "../permission";

export default {
  Mutation: {
    getOrCreateChannel: requiersAuth.createResolver(
      async (parent, { teamId, members }, { models, user }) => {
        const member = await models.Member.findOne(
          {
            where: { teamId, userId: user.id },
          },
          { raw: true }
        );

        if (!member) {
          throw new Error("not a part of team");
        }

        const AllMembers = [...members, user.id];
        const [data, result] = await models.sequelize.query(
          ` select c.id, c.name from channels as c, 
          pcmembers pc where pc.channel_id=c.id and c.dm=true and
           c.public=false and c.team_id=${teamId} group by c.id, c.name having array_agg(pc.user_id)
            @> Array[${AllMembers.join(",")}] and count(pc.user_id)=${
            AllMembers.length
          }`,
          { raw: true }
        );

        if (data.length) {
          return data[0];
        }

        const users = await models.User.findAll({
          raw: true,
          where: {
            id: {
              [models.Sequelize.Op.in]: members,
            },
          },
        });

        const name = users.map((u) => u.username).join(", ");

        const channelId = await models.sequelize.transaction(
          async (transaction) => {
            const channel = await models.Channel.create(
              { name, public: false, dm: true, teamId },
              {
                transaction,
              }
            );

            const cId = channel.dataValues.id;
            const pcmembers = AllMembers.map((m) => ({
              userId: m,
              channelId: cId,
            }));
            console.log("pc mem", pcmembers);
            await models.PCMember.bulkCreate(pcmembers, { transaction });

            return cId;
          }
        );

        return {
          id: channelId,
          name,
        };
      }
    ),
    createChannel: requiersAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const member = await models.Member.findOne(
            {
              where: { teamId: args.teamId, userId: user.id },
            },
            { raw: true }
          );
          if (!member.admin) {
            return {
              ok: false,
              errors: [
                {
                  path: "name",
                  message:
                    "You have to be the owner of the team to create channel",
                },
              ],
            };
          }

          const responce = await models.sequelize.transaction(
            async (transaction) => {
              const channel = await models.Channel.create(args, {
                transaction,
              });
              if (!args.public) {
                const members = args.members.filter((m) => m !== user.id);
                members.push(user.id);
                const pcmembers = args.members.map((m) => ({
                  userId: m,
                  channelId: channel.dataValues.id,
                }));
                await models.PCMember.bulkCreate(pcmembers, { transaction });
              }
              return channel;
            }
          );

          return {
            ok: true,
            channel: responce,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatErrors(err, models),
          };
        }
      }
    ),
  },
};
